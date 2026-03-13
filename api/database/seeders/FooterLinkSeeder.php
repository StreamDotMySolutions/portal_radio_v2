<?php

namespace Database\Seeders;

use App\Models\FooterLink;
use Illuminate\Database\Seeder;

class FooterLinkSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $adminId = \App\Models\User::first()->id;

        $links = [
            // Quick Links
            ['section' => 'quick', 'title' => 'Utama', 'url' => '/', 'is_external' => false, 'ordering' => 1, 'active' => true],
            ['section' => 'quick', 'title' => 'Senarai Radio', 'url' => '/senarai-radio', 'is_external' => false, 'ordering' => 2, 'active' => true],
            ['section' => 'quick', 'title' => 'Chat', 'url' => '/chat', 'is_external' => false, 'ordering' => 3, 'active' => true],
            // Network Links
            ['section' => 'network', 'title' => 'Portal Rasmi RTM', 'url' => 'https://www.rtm.gov.my', 'is_external' => true, 'ordering' => 1, 'active' => true],
            ['section' => 'network', 'title' => 'Berita RTM', 'url' => 'https://berita.rtm.gov.my', 'is_external' => true, 'ordering' => 2, 'active' => true],
            ['section' => 'network', 'title' => 'RTM Klik', 'url' => 'https://rtmklik.rtm.gov.my', 'is_external' => true, 'ordering' => 3, 'active' => true],
        ];

        foreach ($links as $data) {
            FooterLink::create([
                'user_id' => $adminId,
                ...$data,
            ]);
        }
    }
}
