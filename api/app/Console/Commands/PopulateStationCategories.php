<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\StationCategory;
use Illuminate\Support\Facades\DB;

class PopulateStationCategories extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'categories:populate {--force : Skip confirmation}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Populate station categories from seed data';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $categories = [
            ['display_name' => 'Radio Digital', 'slug' => 'radio_online'],
            ['display_name' => 'Nasional', 'slug' => 'nasional'],
            ['display_name' => 'Negeri', 'slug' => 'negeri'],
            ['display_name' => 'Radio Tempatan', 'slug' => 'radio_tempatan'],
        ];

        if (!$this->option('force')) {
            $this->info('This will populate 4 station categories:');
            foreach ($categories as $cat) {
                $this->line("  • {$cat['display_name']} (slug: {$cat['slug']})");
            }

            if (!$this->confirm('Do you want to continue?')) {
                $this->info('Cancelled.');
                return 0;
            }
        }

        $created = 0;
        $updated = 0;

        foreach ($categories as $category) {
            $result = StationCategory::updateOrCreate(
                ['slug' => $category['slug']],
                array_merge($category, ['active' => true])
            );

            if ($result->wasRecentlyCreated) {
                $created++;
                $this->line("<fg=green>✓</> Created: {$category['display_name']}");
            } else {
                $updated++;
                $this->line("<fg=blue>⟳</> Updated: {$category['display_name']}");
            }
        }

        // Initialize nested set structure for proper ordering
        $this->line("<fg=yellow>⟳</> Initializing nested set structure...");
        $this->initializeNestedSet();

        $this->newLine();
        $this->info("✅ Complete! Created: $created, Updated: $updated");
        $this->info("📍 Nested set structure initialized for ordering");

        return 0;
    }

    /**
     * Initialize the nested set structure for all root-level categories.
     */
    private function initializeNestedSet()
    {
        $categories = StationCategory::query()
            ->whereNull('parent_id')
            ->orderBy('id')
            ->get();

        foreach ($categories as $index => $category) {
            DB::table('station_categories')
                ->where('id', $category->id)
                ->update([
                    '_lft' => ($index * 2) + 1,
                    '_rgt' => ($index * 2) + 2,
                ]);
        }
    }
}
