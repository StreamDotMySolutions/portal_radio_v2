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

        Setting::updateOrCreate(
            ['key' => 'footer_description'],
            [
                'value'       => 'Radio Televisyen Malaysia (RTM) adalah penyiar nasional yang menghadirkan konten berkualitas, mendidik, dan menghibur masyarakat Malaysia sejak 1963.',
                'description' => 'Footer section: About Portal Radio RTM',
            ]
        );

        Setting::updateOrCreate(
            ['key' => 'footer_phone'],
            [
                'value'       => '+603 2282 3456',
                'description' => 'Footer contact: Phone number',
            ]
        );

        Setting::updateOrCreate(
            ['key' => 'footer_email'],
            [
                'value'       => 'info@rtm.gov.my',
                'description' => 'Footer contact: Email address',
            ]
        );

        Setting::updateOrCreate(
            ['key' => 'footer_address'],
            [
                'value'       => 'Jalan Semarak, 50564 KL',
                'description' => 'Footer contact: Physical address',
            ]
        );

        Setting::updateOrCreate(
            ['key' => 'footer_copyright'],
            [
                'value'       => '© 2025 RTM — Radio Televisyen Malaysia. Hak Cipta Terpelihara.',
                'description' => 'Footer copyright notice',
            ]
        );

        Setting::updateOrCreate(
            ['key' => 'footer_section_about'],
            [
                'value'       => 'Tentang Portal Radio RTM',
                'description' => 'Footer section title: About',
            ]
        );

        Setting::updateOrCreate(
            ['key' => 'footer_section_quick'],
            [
                'value'       => 'Pautan Pantas',
                'description' => 'Footer section title: Quick Links',
            ]
        );

        Setting::updateOrCreate(
            ['key' => 'footer_section_network'],
            [
                'value'       => 'Rangkaian RTM',
                'description' => 'Footer section title: Network',
            ]
        );

        Setting::updateOrCreate(
            ['key' => 'footer_section_contact'],
            [
                'value'       => 'Hubungi Kami',
                'description' => 'Footer section title: Contact Us',
            ]
        );
    }
}
