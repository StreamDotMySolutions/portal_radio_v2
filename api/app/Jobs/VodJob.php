<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\Process\Process;
use Symfony\Component\Process\Exception\ProcessFailedException;

class VodJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $vod;

    /**
     * Create a new job instance.
     */
    public function __construct($vod)
    {
        $this->vod = $vod;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        //
        \Log::info($this->vod->name);
        /*
        ffmpeg -i rtmklik.mp4 -codec: copy -start_number 0 -hls_time 10 -hls_list_size 0 -f hls hls/playlist.m3u8
        */

        // Define paths
        $storagePath = storage_path('app/public/');
        $inputFile = $storagePath . 'vods/' . $this->vod->name; 
        $outputDir = 'vods/' . $this->vod->id;
        $outputPlaylist =  $storagePath . 'vods/' . $this->vod->id . '/playlist.m3u8';
        // \Log::info($outputDir);
        // Storage::disk('local')->makeDirectory($outputDir);
        //mkdir($outputDir, 0700);
        Storage::disk('public')->makeDirectory($outputDir);

     

        // Define FFmpeg path (Windows)
        $ffmpegPath = 'C:\laragon\bin\ffmpeg\ffmpeg.exe';

        // Define the FFmpeg command
        $command = [
            $ffmpegPath,
            '-i', $inputFile,
            '-codec:', 'copy',
            '-start_number', '0',
            '-hls_time', '10',
            '-hls_list_size', '0',
            '-f', 'hls',
            $outputPlaylist
        ];

        // Execute FFmpeg command
        $process = new Process($command);
        $process->setTimeout(3600); // Set timeout to 1 hour

        try {
            $process->run();

            // Check if the process was successful
            if (!$process->isSuccessful()) {
                throw new ProcessFailedException($process);
            }

            \Log::info('HLS conversion completed: ' . $outputPlaylist);
        } catch (\Exception $e) {
            \Log::error('FFmpeg error: ' . $e->getMessage());
        }
    }
}
