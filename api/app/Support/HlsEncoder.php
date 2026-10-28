<?php

namespace App\Support;

use Illuminate\Support\Facades\Process;
use Illuminate\Support\Str;
use RuntimeException;

/**
 * Turning one video file into adaptive HLS: probe it, pick a ladder, encode, lift a poster frame.
 *
 * Taken from the Junior Innovathon promo encoder. Station videos play on phones over mobile data as
 * well as on desktops, so a master playlist with 1080p / 720p / 480p lets hls.js pick per viewer.
 * Rungs above the source's own height are not made; a source between two rungs gets one at its own
 * height on top, and nothing is ever upscaled.
 *
 * Square pixels first: broadcast clips are often 1440x1080 with a 4:3 sample aspect ratio, and not
 * every player honours SAR inside HLS. The first filter resamples to square pixels, and every rung
 * sets SAR 1 again after scaling (480 x 16/9 rounds to 854 and would otherwise carry 1280:1281).
 *
 * Keyframes every two seconds with scene-cut insertion off, so every rung's segments start on the
 * same frame and switching between them does not stutter.
 *
 * Nothing here writes a record or decides where a video lives: `encode()` takes an output path.
 */
class HlsEncoder
{
    /** Height, video bitrate, max rate, buffer. Heights above the source are dropped. */
    private const LADDER = [
        [1080, '4500k', '4800k', '9000k'],
        [720,  '2500k', '2700k', '5000k'],
        [480,  '1000k', '1100k', '2000k'],
    ];

    private function ffmpeg(): string
    {
        return config('ffmpeg.path');
    }

    private function ffprobe(): string
    {
        return config('ffmpeg.ffprobe');
    }

    /**
     * What the file actually is: real pixels, display width, duration, and whether it has sound.
     *
     * @return array{width:int,height:int,sar:string,sarRatio:float,duration:float,audio:bool}
     */
    public function probe(string $file): array
    {
        $r = Process::timeout(120)->run([
            $this->ffprobe(), '-v', 'error',
            '-show_entries', 'stream=codec_type,width,height,sample_aspect_ratio:format=duration',
            '-of', 'json', $file,
        ]);

        if (! $r->successful()) {
            throw new RuntimeException('ffprobe gagal: ' . Str::limit($r->errorOutput(), 500));
        }

        $j = json_decode($r->output(), true);
        $video = collect($j['streams'] ?? [])->firstWhere('codec_type', 'video');

        if (! $video || empty($video['width']) || empty($video['height'])) {
            throw new RuntimeException('Tiada aliran video dalam fail itu.');
        }

        $sar = $video['sample_aspect_ratio'] ?? '1:1';
        [$sn, $sd] = array_map('intval', explode(':', str_contains($sar, ':') ? $sar : '1:1'));
        $ratio = ($sn > 0 && $sd > 0) ? $sn / $sd : 1.0;

        return [
            'width'    => (int) $video['width'],
            'height'   => (int) $video['height'],
            'sar'      => $sar,
            'sarRatio' => $ratio,
            'duration' => (float) ($j['format']['duration'] ?? 0),
            'audio'    => collect($j['streams'] ?? [])->contains('codec_type', 'audio'),
        ];
    }

    /**
     * The rungs to encode for a source of this height.
     *
     * A source between two ladder heights (e.g. 1024x576) gets a rung at its own height on top, at a
     * bitrate scaled from the 720p rung by area. A source shorter than every rung (e.g. 464 tall
     * after WhatsApp) is carried by that same branch alone.
     */
    public function rungs(int $height): array
    {
        $rungs = array_values(array_filter(self::LADDER, fn ($r) => $r[0] <= $height));

        $sourceHeight = $height - ($height % 2);
        $highest = $rungs[0][0] ?? 0;

        if ($sourceHeight > $highest && $sourceHeight < self::LADDER[0][0]) {
            $kbps = (int) round(2500 * ($sourceHeight / 720) ** 2);
            array_unshift($rungs, [$sourceHeight, "{$kbps}k", (int) round($kbps * 1.08) . 'k', ($kbps * 2) . 'k']);
        }

        return $rungs;
    }

    /** The heights of a rung list, for a manifest or the admin table. */
    public static function heights(array $rungs): array
    {
        return array_map(fn ($r) => $r[0], $rungs);
    }

    public function encode(string $file, string $out, array $rungs, bool $audio): void
    {
        $n = count($rungs);

        // Square pixels once, then one scaled branch per rung.
        $labels = implode('', array_map(fn ($i) => "[s{$i}]", range(0, $n - 1)));
        $graph  = "[0:v]scale=iw*sar:ih,setsar=1,split={$n}{$labels}";
        foreach ($rungs as $i => $r) {
            $graph .= ";[s{$i}]scale=-2:{$r[0]},setsar=1[v{$i}]";
        }

        $args = [$this->ffmpeg(), '-nostdin', '-y', '-i', $file, '-filter_complex', $graph];

        foreach ($rungs as $i => $r) {
            $args[] = '-map';
            $args[] = "[v{$i}]";
        }
        if ($audio) {
            foreach ($rungs as $i => $r) {
                $args[] = '-map';
                $args[] = '0:a:0';
            }
        }

        array_push($args,
            '-c:v', 'libx264', '-preset', 'veryfast', '-profile:v', 'main', '-pix_fmt', 'yuv420p',
            // Two-second GOPs at 25 fps, no scene cuts: every rung's segments line up.
            '-g', '50', '-keyint_min', '50', '-sc_threshold', '0',
        );

        foreach ($rungs as $i => $r) {
            array_push($args, "-b:v:{$i}", $r[1], "-maxrate:v:{$i}", $r[2], "-bufsize:v:{$i}", $r[3]);
        }

        if ($audio) {
            array_push($args, '-c:a', 'aac', '-b:a', '128k', '-ac', '2');
        }

        $map = implode(' ', array_map(fn ($i) => $audio ? "v:{$i},a:{$i}" : "v:{$i}", range(0, $n - 1)));

        array_push($args,
            '-f', 'hls', '-hls_time', '4', '-hls_playlist_type', 'vod',
            '-hls_flags', 'independent_segments',
            '-hls_segment_filename', "{$out}/v%v/seg_%03d.ts",
            '-master_pl_name', 'master.m3u8',
            '-var_stream_map', $map,
            "{$out}/v%v/index.m3u8",
        );

        $r = Process::timeout(3600)->run($args);

        if (! $r->successful() || ! is_file("{$out}/master.m3u8")) {
            throw new RuntimeException('ffmpeg gagal: ' . Str::limit($r->errorOutput(), 1500));
        }
    }

    public function poster(string $file, string $to, float $at): void
    {
        $r = Process::timeout(120)->run([
            $this->ffmpeg(), '-nostdin', '-y', '-ss', (string) $at, '-i', $file, '-frames:v', '1',
            '-vf', 'scale=iw*sar:ih,setsar=1,scale=1280:-2', '-q:v', '3', $to,
        ]);

        if (! $r->successful() || ! is_file($to)) {
            throw new RuntimeException('Poster gagal: ' . Str::limit($r->errorOutput(), 500));
        }
    }
}
