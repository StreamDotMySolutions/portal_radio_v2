<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Station;
use App\Models\StationCategory;

class UpdateStationCategories extends Command
{
    protected $signature = 'stations:update-categories {--fix}';
    protected $description = 'Validate and update existing stations to use populated categories';

    public function handle()
    {
        $this->info('Checking existing stations against station_categories table...');
        $this->newLine();

        // Get all valid category slugs
        $validSlugs = StationCategory::pluck('slug')->toArray();
        $this->info('Valid categories: ' . implode(', ', $validSlugs));
        $this->newLine();

        // Get all stations grouped by category
        $stationsByCategory = Station::all()->groupBy('category');

        $issues = [];
        $validCount = 0;
        $invalidCount = 0;

        foreach ($stationsByCategory as $category => $stations) {
            $count = $stations->count();
            $slug = $category ?: '(null)';

            if (in_array($category, $validSlugs)) {
                $this->line('  ✓ <fg=green>' . $slug . '</>: ' . $count . ' station' . ($count !== 1 ? 's' : ''));
                $validCount += $count;
            } else {
                $this->line('  ✗ <fg=red>' . $slug . '</>: ' . $count . ' station' . ($count !== 1 ? 's' : ''));
                $invalidCount += $count;

                foreach ($stations as $station) {
                    $issues[] = [
                        'station_id' => $station->id,
                        'station_title' => $station->title,
                        'current_category' => $category,
                        'suggestion' => $this->suggestCorrection($category, $validSlugs),
                    ];
                }
            }
        }

        $this->newLine();
        $this->info('Summary:');
        $this->line('  Valid stations: ' . $validCount);
        $this->line('  Invalid stations: ' . $invalidCount);

        if (empty($issues)) {
            $this->info('✓ All stations have valid categories!');
            return Command::SUCCESS;
        }

        $this->newLine();
        $this->warn('Issues found:');
        foreach ($issues as $issue) {
            $this->line(
                '  Station ID ' . $issue['station_id'] .
                ' (' . $issue['station_title'] . '): ' .
                'category="' . ($issue['current_category'] ?: 'null') . '" ' .
                '→ suggested: "' . $issue['suggestion'] . '"'
            );
        }

        if ($this->option('fix')) {
            $this->newLine();
            if ($this->confirm('Apply suggested fixes to ' . $invalidCount . ' station' . ($invalidCount !== 1 ? 's' : '') . '?')) {
                $this->fixIssues($issues);
                $this->info('✓ Stations updated successfully!');
            }
        } else {
            $this->newLine();
            $this->info('Run with <fg=yellow>--fix</> flag to apply corrections.');
            $this->info('Example: <fg=yellow>php artisan stations:update-categories --fix</>');
        }

        return Command::SUCCESS;
    }

    /**
     * Suggest the correct category slug for an invalid one
     */
    private function suggestCorrection($invalidSlug, array $validSlugs)
    {
        // Check for underscore/hyphen mismatch
        $normalized = str_replace('_', '-', $invalidSlug);
        if (in_array($normalized, $validSlugs)) {
            return $normalized;
        }

        // Check for common typos or similar names
        $slug = strtolower(trim($invalidSlug));
        if (str_contains($slug, 'online')) {
            return 'radio-online';
        }
        if (str_contains($slug, 'tempatan')) {
            return 'radio-tempatan';
        }
        if (str_contains($slug, 'nasional')) {
            return 'nasional';
        }
        if (str_contains($slug, 'negeri')) {
            return 'negeri';
        }

        // Default to first valid category
        return $validSlugs[0] ?? 'nasional';
    }

    /**
     * Apply fixes to invalid categories
     */
    private function fixIssues(array $issues)
    {
        $this->newLine();
        $bar = $this->output->createProgressBar(count($issues));
        $bar->start();

        foreach ($issues as $issue) {
            Station::whereId($issue['station_id'])
                ->update(['category' => $issue['suggestion']]);
            $bar->advance();
        }

        $bar->finish();
        $this->newLine();
    }
}
