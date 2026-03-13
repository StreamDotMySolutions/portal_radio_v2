<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class FooterSectionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
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
