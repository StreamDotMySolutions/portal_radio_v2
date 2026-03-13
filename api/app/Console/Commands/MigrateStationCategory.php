<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class MigrateStationCategory extends Command
{
    protected $signature = 'stations:migrate-category';

    protected $description = 'Backfill station_category_id from the old category slug column';

    public function handle(): void
    {
        // Ensure station_categories has data
        $categoryCount = DB::table('station_categories')->count();
        if ($categoryCount === 0) {
            $this->error('station_categories table is empty. Run StationCategorySeeder first.');
            return;
        }

        $this->info("Found {$categoryCount} categories.");

        // Step 1: Normalise underscore slugs → hyphens (old enum stored radio_tempatan, radio_online)
        if (Schema::hasColumn('stations', 'category')) {
            $normalised = DB::table('stations')
                ->where('category', 'LIKE', '%\_%')
                ->update(['category' => DB::raw("REPLACE(category, '_', '-')")]);

            $this->info("Normalised {$normalised} station category slugs (underscore → hyphen).");

            // Step 2: Populate station_category_id from category slug
            $updated = DB::statement('
                UPDATE stations s
                JOIN station_categories sc ON s.category = sc.slug
                SET s.station_category_id = sc.id
                WHERE s.station_category_id IS NULL
            ');

            $total = DB::table('stations')->whereNotNull('station_category_id')->count();
            $this->info("Populated station_category_id for {$total} stations.");
        } else {
            // category column already dropped — only fix NULL station_category_id if any remain
            $this->info('category column already removed. Checking for NULL station_category_id...');
        }

        // Step 3: Report unmatched rows
        $unmatched = DB::table('stations')->whereNull('station_category_id')->count();

        if ($unmatched > 0) {
            $this->warn("{$unmatched} station(s) could not be matched to a category:");
            DB::table('stations')
                ->whereNull('station_category_id')
                ->select('id', 'title', 'category')
                ->each(function ($station) {
                    $cat = isset($station->category) ? $station->category : '(no category column)';
                    $this->line("  - [{$station->id}] {$station->title} (category: {$cat})");
                });
        } else {
            $this->info('All stations have a valid station_category_id. Migration complete!');
        }
    }
}
