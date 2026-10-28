<?php

namespace App\Jobs;

use App\Models\StationVideo;
use App\Services\StationVideoService;
use App\Support\HlsEncoder;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Throwable;

/**
 * Transcode one uploaded station video to adaptive HLS (1080/720/480p) with a poster frame.
 *
 * Output goes to a new version directory; the record only points at it once it is complete, so a
 * player never sees half a video and a re-upload replaces the old one without a gap. The previous
 * version is removed afterwards, and the uploaded source once the new version is live.
 */
class TranscodeStationVideo implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $timeout = 3600;
    public $tries = 1;

    public function __construct(public StationVideo $video)
    {
        $this->onQueue('video');
    }

    public function handle(HlsEncoder $hls, StationVideoService $service): void
    {
        $video = $this->video->fresh();
        $source = $video?->sourcePath();

        if (! $video || ! $source || ! is_file($source)) {
            $video?->update(['status' => 'failed', 'error' => 'Fail sumber tidak dijumpai. Sila muat naik semula.']);
            return;
        }

        $video->update(['status' => 'processing', 'error' => null]);

        $version = now()->format('YmdHis') . '-' . Str::lower(Str::random(4));
        $relative = "{$video->directory()}/{$version}";
        $out = Storage::disk('public')->path($relative);

        try {
            Storage::disk('public')->makeDirectory($relative);

            $probe = $hls->probe($source);
            $rungs = $hls->rungs($probe['height']);

            $hls->encode($source, $out, $rungs, $probe['audio']);
            $hls->poster($source, "{$out}/poster.jpg", min(15.0, $probe['duration'] / 2));
        } catch (Throwable $e) {
            Storage::disk('public')->deleteDirectory($relative);
            $video->update(['status' => 'failed', 'error' => Str::limit($e->getMessage(), 1000)]);
            Log::warning("Station video {$video->id} transcode failed: " . Str::limit($e->getMessage(), 300));
            return;
        }

        $previous = $video->version;

        $video->update([
            'status'          => 'ready',
            'error'           => null,
            'version'         => $version,
            'duration'        => round($probe['duration'], 2),
            'width'           => (int) round($probe['width'] * $probe['sarRatio']),
            'height'          => $probe['height'],
            'renditions'      => HlsEncoder::heights($rungs),
            'hls_size'        => $service->directorySize($relative),
            'source_filename' => null,
        ]);

        Storage::disk('local')->delete(StationVideo::INBOX . '/' . basename($source));

        if ($previous && $previous !== $version) {
            Storage::disk('public')->deleteDirectory("{$video->directory()}/{$previous}");
        }
    }

    // Worker timeout or crash: handle() never reached its own catch
    public function failed(?Throwable $e): void
    {
        $this->video->fresh()?->update([
            'status' => 'failed',
            'error'  => Str::limit($e?->getMessage() ?: 'Penukaran video terhenti.', 1000),
        ]);
    }
}
