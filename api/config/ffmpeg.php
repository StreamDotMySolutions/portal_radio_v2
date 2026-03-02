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

return [
    'path' => env(
        'FFMPEG_PATH',
        strtoupper(substr(PHP_OS, 0, 3)) === 'WIN'
            ? 'C:/ffmpeg/ffmpeg.exe'
            : '/usr/bin/ffmpeg'
    ),
];