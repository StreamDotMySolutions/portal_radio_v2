<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\StationCategory;

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
            ['display_name' => 'Radio Digital', 'slug' => 'radio_online', 'sort_order' => 1],
            ['display_name' => 'Nasional', 'slug' => 'nasional', 'sort_order' => 2],
            ['display_name' => 'Negeri', 'slug' => 'negeri', 'sort_order' => 3],
            ['display_name' => 'Radio Tempatan', 'slug' => 'radio_tempatan', 'sort_order' => 4],
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

        $this->newLine();
        $this->info("✅ Complete! Created: $created, Updated: $updated");

        return 0;
    }
}
