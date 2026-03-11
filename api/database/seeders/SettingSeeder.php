<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class SettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Setting::updateOrCreate(
            ['key' => 'livestream_url'],
            [
                'value'       => 'https://nasionalfm.rtm.gov.my/hls/nasionalfm.m3u8',
                'description' => 'HLS stream URL for the homepage Siaran Langsung section',
            ]
        );
    }
}
