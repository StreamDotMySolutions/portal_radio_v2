<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\StationCategory;

class StationCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            ['display_name' => 'Radio Digital', 'slug' => 'radio_online', 'sort_order' => 1],
            ['display_name' => 'Nasional', 'slug' => 'nasional', 'sort_order' => 2],
            ['display_name' => 'Negeri', 'slug' => 'negeri', 'sort_order' => 3],
            ['display_name' => 'Radio Tempatan', 'slug' => 'radio_tempatan', 'sort_order' => 4],
        ];

        foreach ($categories as $category) {
            StationCategory::updateOrCreate(
                ['slug' => $category['slug']],
                $category
            );
        }
    }
}
