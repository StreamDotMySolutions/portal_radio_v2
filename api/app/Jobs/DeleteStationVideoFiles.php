<?php

namespace App\Jobs;

use App\Models\StationVideo;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Storage;

/**
 * Remove a deleted station video's HLS files and any waiting upload.
 *
 * Runs on the queue worker, which wrote the files: the worker (PM2) and PHP-FPM can be different users,
 * and PHP-FPM may not be allowed to delete what the worker created. Same queue as the transcode, so a
 * video deleted mid-transcode is cleaned up after that job finishes writing.
 */
class DeleteStationVideoFiles implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable;

    public $tries = 3;

    public function __construct(public int $videoId, public ?string $sourceFilename = null)
    {
        $this->onQueue('video');
    }

    public function handle(): void
    {
        Storage::disk('public')->deleteDirectory(StationVideo::ROOT . '/' . $this->videoId);

        if ($this->sourceFilename) {
            Storage::disk('local')->delete(StationVideo::INBOX . '/' . $this->sourceFilename);
        }
    }
}
