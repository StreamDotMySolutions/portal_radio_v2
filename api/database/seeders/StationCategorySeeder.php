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
            ['display_name' => 'Radio Digital', 'slug' => 'radio_online'],
            ['display_name' => 'Nasional', 'slug' => 'nasional'],
            ['display_name' => 'Negeri', 'slug' => 'negeri'],
            ['display_name' => 'Radio Tempatan', 'slug' => 'radio_tempatan'],
        ];

        foreach ($categories as $index => $category) {
            StationCategory::updateOrCreate(
                ['slug' => $category['slug']],
                array_merge($category, ['active' => true])
            );
        }
    }
}
