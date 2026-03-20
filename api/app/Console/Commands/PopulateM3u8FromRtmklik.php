<?php

namespace App\Console\Commands;

use App\Models\Station;
use Illuminate\Console\Command;

class PopulateM3u8FromRtmklik extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'stations:populate-m3u8-from-rtmklik {--force : Skip confirmation and apply changes}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Populate M3U8 stream URLs from existing RTMKlik player URLs';

    /**
     * Extract radio code from RTMKlik URL
     * Example: https://rtmklik-radio-player.s3.../index.html?radio=NASIONAL_FM
     * Returns: NASIONAL_FM
     */
    private function extractRadioCode($rtmklikUrl): ?string
    {
        if (!$rtmklikUrl) return null;

        $parsed = parse_url($rtmklikUrl);
        if (!isset($parsed['query'])) return null;

        parse_str($parsed['query'], $query);
        return $query['radio'] ?? null;
    }

    /**
     * Generate M3U8 URL from radio code
     * Pattern: https://playerservices.streamtheworld.com/api/livestream-redirect/{RADIO_CODE}AAC.m3u8
     * Example: NASIONAL_FM → https://playerservices.streamtheworld.com/api/livestream-redirect/NASIONAL_FMAAC.m3u8
     */
    private function generateM3u8Url($radioCode): string
    {
        return "https://playerservices.streamtheworld.com/api/livestream-redirect/{$radioCode}AAC.m3u8";
    }

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $this->info('🔍 Scanning stations for RTMKlik URLs...');

        // Find all stations with RTMKlik URLs and without stream_url
        $stations = Station::query()
            ->whereNotNull('rtmklik_player_url')
            ->where(function ($q) {
                $q->whereNull('stream_url')
                  ->orWhere('stream_url', '');
            })
            ->get();

        if ($stations->isEmpty()) {
            $this->info('✓ No stations need M3U8 population.');
            return 0;
        }

        $this->info("Found {$stations->count()} station(s) to process:\n");

        $updates = [];
        foreach ($stations as $station) {
            $radioCode = $this->extractRadioCode($station->rtmklik_player_url);
            if (!$radioCode) {
                $this->warn("⚠ Skipped: {$station->title} (could not extract radio code)");
                continue;
            }

            $m3u8Url = $this->generateM3u8Url($radioCode);
            $this->line("  📻 {$station->title}");
            $this->line("     Radio Code: {$radioCode}");
            $this->line("     M3U8 URL: {$m3u8Url}");

            $updates[] = [
                'station' => $station,
                'radioCode' => $radioCode,
                'm3u8Url' => $m3u8Url,
            ];
        }

        if (empty($updates)) {
            $this->info('✓ No valid stations to update.');
            return 0;
        }

        $this->newLine();

        // Confirm before applying
        if (!$this->option('force')) {
            $count = count($updates);
            if (!$this->confirm("Apply these {$count} update(s)?", true)) {
                $this->info('❌ Cancelled.');
                return 0;
            }
        }

        // Apply updates
        $this->info('💾 Updating stations...');
        foreach ($updates as $update) {
            $update['station']->update([
                'player_type' => 'm3u8',
                'stream_url' => $update['m3u8Url'],
            ]);
            $this->line("  ✓ {$update['station']->title}");
        }

        $this->info("\n✅ Successfully updated " . count($updates) . ' station(s)!');
        return 0;
    }
}
