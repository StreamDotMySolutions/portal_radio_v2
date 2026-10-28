<?php

namespace App\Services;

use App\Jobs\DeleteStationVideoFiles;
use App\Jobs\TranscodeStationVideo;
use App\Models\StationVideo;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class StationVideoService
{
    public function listForAdmin(array $filters)
    {
        $query = StationVideo::query()->with('station:id,title,slug');

        if (! empty($filters['station_id'])) {
            $query->where('station_id', $filters['station_id']);
        }

        if (! empty($filters['search'])) {
            $query->where('title', 'like', "%{$filters['search']}%");
        }

        $sortBy = $filters['sort_by'] ?? null;
        $sortDir = ($filters['sort_dir'] ?? 'desc') === 'asc' ? 'asc' : 'desc';

        if ($sortBy === 'name') {
            $query->orderBy('title', $sortDir);
        } elseif ($sortBy === 'date') {
            $query->orderBy('created_at', $sortDir);
        } else {
            $query->orderBy('station_id')->defaultOrder();
        }

        return $query->paginate(10)->withQueryString();
    }

    // Active, transcoded videos of one station, in their ordering
    public function listForStation(int $stationId)
    {
        return StationVideo::query()
            ->where('station_id', $stationId)
            ->where('active', true)
            ->where('status', 'ready')
            ->defaultOrder()
            ->get()
            ->map(fn (StationVideo $v) => [
                'id'          => $v->id,
                'title'       => $v->title,
                'description' => $v->description,
                'duration'    => $v->duration,
                'width'       => $v->width,
                'height'      => $v->height,
                'hls'         => $v->hls_url,
                'poster'      => $v->poster_url,
            ]);
    }

    public function store(array $data, UploadedFile $file, ?int $userId): StationVideo
    {
        $video = StationVideo::create([
            'station_id'      => $data['station_id'],
            'user_id'         => $userId,
            'title'           => $data['title'],
            'description'     => $data['description'] ?? null,
            'source_filename' => $this->storeSource($file),
            'status'          => 'pending',
        ]);

        TranscodeStationVideo::dispatch($video);

        return $video;
    }

    public function update(StationVideo $video, array $data, ?UploadedFile $file): StationVideo
    {
        $video->fill(collect($data)->only(['title', 'description'])->all());

        if ($file) {
            $this->deleteSource($video);
            $video->source_filename = $this->storeSource($file);
            $video->status = 'pending';
            $video->error = null;
        }

        // The station is fixed after create: ordering is a nested set scoped per station
        $video->save();

        if ($file) {
            TranscodeStationVideo::dispatch($video);
        }

        return $video;
    }

    public function retry(StationVideo $video): bool
    {
        $source = $video->sourcePath();

        if ($video->status !== 'failed' || ! $source || ! is_file($source)) {
            return false;
        }

        $video->update(['status' => 'pending', 'error' => null]);
        TranscodeStationVideo::dispatch($video);

        return true;
    }

    public function delete(StationVideo $video): void
    {
        $video->delete();
        DeleteStationVideoFiles::dispatch($video->id, $video->source_filename);
    }

    public function directorySize(string $relative): int
    {
        return array_sum(array_map(
            fn ($f) => Storage::disk('public')->size($f),
            Storage::disk('public')->allFiles($relative)
        ));
    }

    private function storeSource(UploadedFile $file): string
    {
        $ext = strtolower($file->getClientOriginalExtension() ?: 'mp4');
        $name = time() . '-' . Str::lower(Str::random(8)) . '.' . preg_replace('/[^a-z0-9]/', '', $ext);

        Storage::disk('local')->putFileAs(StationVideo::INBOX, $file, $name);

        return $name;
    }

    private function deleteSource(StationVideo $video): void
    {
        if ($video->source_filename) {
            Storage::disk('local')->delete(StationVideo::INBOX . '/' . $video->source_filename);
        }
    }
}
