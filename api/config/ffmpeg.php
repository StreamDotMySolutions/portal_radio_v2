<?php

    /*
    |--------------------------------------------------------------------------
    | FFmpeg binary path
    |--------------------------------------------------------------------------
    |
    | Location of the ffmpeg executable.  You can override it via the
    | FFMPEG_PATH environment variable; otherwise an OS‑specific default
    | will be returned.
    |
    */

$windows = strtoupper(substr(PHP_OS, 0, 3)) === 'WIN';

return [
    'path' => env('FFMPEG_PATH', $windows ? 'C:/ffmpeg/ffmpeg.exe' : '/usr/bin/ffmpeg'),

    // ffprobe reads a station video's size, aspect and duration before it is transcoded
    'ffprobe' => env('FFPROBE_PATH', $windows ? 'C:/ffmpeg/ffprobe.exe' : '/usr/bin/ffprobe'),

    // Largest station video upload, in MB (nginx client_max_body_size and PHP post_max_size must allow it)
    'max_upload_mb' => (int) env('STATION_VIDEO_MAX_MB', 1024),
];
