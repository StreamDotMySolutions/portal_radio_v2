<?php

namespace Database\Seeders;

use App\Models\Station;
use Illuminate\Database\Seeder;

class TempataStationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $adminId = \App\Models\User::first()->id;

        $stations = [
            ['title' => 'Langkawi FM', 'slug' => 'langkawi-fm'],
            ['title' => 'Labuan FM', 'slug' => 'labuan-fm'],
            ['title' => 'Sabah V FM', 'slug' => 'sabah-v-fm'],
            ['title' => 'Keningau FM', 'slug' => 'keningau-fm'],
            ['title' => 'Sandakan FM', 'slug' => 'sandakan-fm'],
            ['title' => 'Tawau FM', 'slug' => 'tawau-fm'],
            ['title' => 'WAI FM Iban', 'slug' => 'wai-fm-iban'],
            ['title' => 'WAI FM Bidayuh', 'slug' => 'wai-fm-bidayuh'],
            ['title' => 'RED FM', 'slug' => 'red-fm'],
            ['title' => 'Limbang FM', 'slug' => 'limbang-fm'],
            ['title' => 'Miri FM', 'slug' => 'miri-fm'],
            ['title' => 'Sibu FM', 'slug' => 'sibu-fm'],
            ['title' => 'Sri Aman FM', 'slug' => 'sri-aman-fm'],
            ['title' => 'Bintulu FM', 'slug' => 'bintulu-fm'],
            ['title' => 'Mukah FM', 'slug' => 'mukah-fm'],
            ['title' => 'Kapit FM', 'slug' => 'kapit-fm'],
            ['title' => 'Beaufort FM', 'slug' => 'beaufort-fm'],
            ['title' => 'Semporna FM', 'slug' => 'semporna-fm'],
            ['title' => 'Kunak FM', 'slug' => 'kunak-fm'],
            ['title' => 'Lahad Datu FM', 'slug' => 'lahad-datu-fm'],
        ];

        // Get tempatan category ID
        $tempataCategory = \App\Models\StationCategory::where('slug', 'radio-tempatan')->first();

        foreach ($stations as $data) {
            Station::updateOrCreate(
                ['slug' => $data['slug']],
                [
                    'user_id' => $adminId,
                    'title' => $data['title'],
                    'station_category_id' => $tempataCategory->id,
                    'active' => true,
                ]
            );
        }
    }
}
