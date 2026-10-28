<?php

use App\Jobs\TranscodeStationVideo;
use App\Models\Station;
use App\Models\StationCategory;
use App\Models\StationVideo;
use App\Models\User;
use App\Services\StationVideoService;
use App\Support\HlsEncoder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Process;
use Illuminate\Support\Facades\Queue;
use Illuminate\Support\Facades\Storage;
use Laravel\Sanctum\Sanctum;
use Spatie\Permission\Middleware\RoleMiddleware;

uses(RefreshDatabase::class);

beforeEach(function () {
    Storage::fake('public');
    Storage::fake('local');
});

function videoStation(array $attrs = []): Station
{
    $user = User::factory()->create(['password' => 'password']);
    $slug = 'stesen-' . substr(uniqid(), -6);
    $category = StationCategory::create(['display_name' => 'Nasional', 'slug' => 'kat-' . substr(uniqid(), -6)]);

    return Station::create(array_merge([
        'user_id' => $user->id,
        'station_category_id' => $category->id,
        'title' => 'Stesen Ujian',
        'slug' => $slug,
        'active' => 1,
    ], $attrs));
}

function actingAsVideoAdmin($test): void
{
    Sanctum::actingAs(User::factory()->create(['password' => 'password']));
    $test->withoutMiddleware(RoleMiddleware::class);
}

function storedVideo(Station $station, array $attrs = []): StationVideo
{
    return StationVideo::create(array_merge([
        'station_id' => $station->id,
        'title' => 'Promo ' . uniqid(),
        'status' => 'ready',
        'version' => '20261028-abcd',
        'active' => true,
    ], $attrs));
}

// ffprobe/ffmpeg stand-ins: probe answers 1920x1080 with audio, encode/poster write the files
function fakeFfmpeg(bool $encodeFails = false): void
{
    Process::fake(function ($process) use ($encodeFails) {
        $cmd = $process->command;
        $args = is_array($cmd) ? $cmd : [$cmd];

        if (str_contains($args[0], 'ffprobe')) {
            return Process::result(json_encode([
                'streams' => [
                    ['codec_type' => 'video', 'width' => 1920, 'height' => 1080, 'sample_aspect_ratio' => '1:1'],
                    ['codec_type' => 'audio'],
                ],
                'format' => ['duration' => '42.5'],
            ]));
        }

        if (in_array('-master_pl_name', $args, true)) {
            if ($encodeFails) {
                return Process::result('', 'Invalid data found when processing input', 1);
            }
            $out = dirname(dirname(end($args)));
            File::ensureDirectoryExists("{$out}/v0");
            file_put_contents("{$out}/master.m3u8", '#EXTM3U');
            file_put_contents("{$out}/v0/index.m3u8", '#EXTM3U');
            file_put_contents("{$out}/v0/seg_000.ts", str_repeat('x', 1000));
            return Process::result();
        }

        file_put_contents(end($args), 'jpeg');   // poster
        return Process::result();
    });
}

it('stores an upload as pending and queues the transcode', function () {
    Queue::fake();
    actingAsVideoAdmin($this);
    $station = videoStation();

    $this->post('/api/station-videos', [
        'station_id' => $station->id,
        'title' => 'Promo Raya',
        'file' => UploadedFile::fake()->create('promo.mp4', 2048, 'video/mp4'),
    ], ['Accept' => 'application/json'])->assertCreated();

    $video = StationVideo::first();
    expect($video->status)->toBe('pending')
        ->and($video->source_filename)->not->toBeNull();
    Storage::disk('local')->assertExists(StationVideo::INBOX . '/' . $video->source_filename);
    Queue::assertPushedOn('video', TranscodeStationVideo::class);
});

it('validates the upload', function (array $payload, string $field) {
    Queue::fake();
    actingAsVideoAdmin($this);
    $station = videoStation();

    $this->post('/api/station-videos', array_merge([
        'station_id' => $station->id,
        'title' => 'Promo',
        'file' => UploadedFile::fake()->create('promo.mp4', 100, 'video/mp4'),
    ], $payload), ['Accept' => 'application/json'])
        ->assertStatus(422)
        ->assertJsonValidationErrors($field);

    Queue::assertNothingPushed();
})->with([
    'not a video' => [['file' => UploadedFile::fake()->create('notes.pdf', 10, 'application/pdf')], 'file'],
    'no file' => [['file' => null], 'file'],
    'unknown station' => [['station_id' => 999999], 'station_id'],
    'no title' => [['title' => ''], 'title'],
]);

it('keeps the admin endpoints behind sign-in', function () {
    $this->getJson('/api/station-videos')->assertStatus(401);
});

it('transcodes to HLS, publishes the version and removes the source', function () {
    fakeFfmpeg();
    $station = videoStation();
    Storage::disk('local')->put(StationVideo::INBOX . '/src.mp4', 'video');
    $video = storedVideo($station, ['status' => 'pending', 'version' => null, 'source_filename' => 'src.mp4']);

    (new TranscodeStationVideo($video))->handle(app(HlsEncoder::class), app(StationVideoService::class));

    $video->refresh();
    expect($video->status)->toBe('ready')
        ->and($video->version)->not->toBeNull()
        ->and($video->renditions)->toBe([1080, 720, 480])
        ->and($video->duration)->toBe(42.5)
        ->and($video->width)->toBe(1920)
        ->and($video->hls_size)->toBeGreaterThan(0)
        ->and($video->source_filename)->toBeNull();
    Storage::disk('public')->assertExists("station-videos/{$video->id}/{$video->version}/master.m3u8");
    Storage::disk('local')->assertMissing(StationVideo::INBOX . '/src.mp4');
});

it('marks the video failed when ffmpeg fails, and keeps the source for a retry', function () {
    fakeFfmpeg(encodeFails: true);
    $station = videoStation();
    Storage::disk('local')->put(StationVideo::INBOX . '/src.mp4', 'video');
    $video = storedVideo($station, ['status' => 'pending', 'version' => null, 'source_filename' => 'src.mp4']);

    (new TranscodeStationVideo($video))->handle(app(HlsEncoder::class), app(StationVideoService::class));

    $video->refresh();
    expect($video->status)->toBe('failed')
        ->and($video->error)->toContain('ffmpeg gagal')
        ->and($video->version)->toBeNull();
    Storage::disk('local')->assertExists(StationVideo::INBOX . '/src.mp4');
    expect(Storage::disk('public')->allFiles("station-videos/{$video->id}"))->toBe([]);

    Queue::fake();
    actingAsVideoAdmin($this);
    $this->postJson("/api/station-videos/{$video->id}/retry")->assertOk();
    expect($video->fresh()->status)->toBe('pending');
    Queue::assertPushed(TranscodeStationVideo::class);
});

it('refuses to retry a video that is not failed', function () {
    actingAsVideoAdmin($this);
    $video = storedVideo(videoStation());

    $this->postJson("/api/station-videos/{$video->id}/retry")->assertStatus(422);
});

it('lists only active, ready videos of the station in their order', function () {
    $station = videoStation();
    $other = videoStation();
    $first = storedVideo($station, ['title' => 'Pertama']);
    $second = storedVideo($station, ['title' => 'Kedua']);
    storedVideo($station, ['title' => 'Tersembunyi', 'active' => false]);
    storedVideo($station, ['title' => 'Belum siap', 'status' => 'processing', 'version' => null]);
    storedVideo($other, ['title' => 'Stesen lain']);
    $second->up();

    $res = $this->getJson("/api/frontend/stations/{$station->slug}/videos")->assertOk();

    expect(collect($res->json('videos'))->pluck('title')->all())->toBe(['Kedua', 'Pertama'])
        ->and($res->json('videos.0.hls'))->toBe("station-videos/{$second->id}/20261028-abcd/master.m3u8")
        ->and($res->json('videos.0.poster'))->toEndWith('/poster.jpg');
});

it('hides the videos of an inactive station', function () {
    $station = videoStation(['active' => 0]);
    storedVideo($station);

    $this->getJson("/api/frontend/stations/{$station->slug}/videos")->assertNotFound();
});

it('deletes the record and its files', function () {
    actingAsVideoAdmin($this);
    $video = storedVideo(videoStation());
    Storage::disk('public')->put("station-videos/{$video->id}/{$video->version}/master.m3u8", '#EXTM3U');

    $this->deleteJson("/api/station-videos/{$video->id}")->assertOk();

    expect(StationVideo::find($video->id))->toBeNull();
    Storage::disk('public')->assertMissing("station-videos/{$video->id}/{$video->version}/master.m3u8");
});

it('builds a ladder that never upscales', function (int $height, array $expected) {
    expect(HlsEncoder::heights(app(HlsEncoder::class)->rungs($height)))->toBe($expected);
})->with([
    '1080p source' => [1080, [1080, 720, 480]],
    '2160p source' => [2160, [1080, 720, 480]],
    '576p source' => [576, [576, 480]],
    '464p source' => [464, [464]],
]);

it('reports an upload the server could not save instead of queueing a missing file', function () {
    Queue::fake();
    actingAsVideoAdmin($this);
    $station = videoStation();
    $disk = Mockery::mock(Storage::disk('local'))->makePartial();
    $disk->shouldReceive('putFileAs')->andReturn(false);
    Storage::set('local', $disk);

    $this->post('/api/station-videos', [
        'station_id' => $station->id,
        'title' => 'Promo',
        'file' => UploadedFile::fake()->create('promo.mp4', 100, 'video/mp4'),
    ], ['Accept' => 'application/json'])
        ->assertStatus(500)
        ->assertJsonPath('message', fn ($m) => str_contains($m, 'tidak boleh ditulis'));

    expect(StationVideo::count())->toBe(0);
    Queue::assertNothingPushed();
});
