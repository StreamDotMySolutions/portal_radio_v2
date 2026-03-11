<?php

namespace Database\Seeders;

use App\Models\Banner;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;

class BannerSeeder extends Seeder
{
    private array $banners = [
        ['title' => 'Selamat Datang ke RTM',           'description' => 'Radio Televisyen Malaysia — Suara Rasmi Negara', 'filename' => '1700000000-hero-banner.jpg'],
        ['title' => 'Siaran Langsung 24 Jam',           'description' => 'Nikmati siaran langsung tanpa henti di saluran RTM', 'filename' => '1700000001-carausel-banner.jpg'],
        ['title' => 'Ramadan Berkah',                   'description' => 'Bulan penuh berkah bersama RTM', 'filename' => '1700000002-ramadan.jpg'],
        ['title' => 'Berita Terkini RTM',               'description' => 'Ikuti perkembangan berita semasa dari seluruh Malaysia', 'filename' => '1700000003-carousel-1.jpg'],
        ['title' => 'Program Kanak-Kanak',              'description' => 'Hiburan mendidik untuk generasi muda Malaysia', 'filename' => '1700000004-carousel-2.jpg'],
        ['title' => 'Sukan Malaysia',                   'description' => 'Liputan sukan penuh dari seluruh dunia', 'filename' => '1700000005-carousel-3.jpg'],
        ['title' => 'Dokumentari Alam Semula Jadi',     'description' => 'Terokai keindahan alam nusantara bersama RTM', 'filename' => '1700000006-carousel-4.jpg'],
        ['title' => 'Muzik Malaysia',                   'description' => 'Lagu-lagu terbaik dari artis tempatan dan antarabangsa', 'filename' => '1700000007-carousel-5.jpg'],
    ];

    public function run(): void
    {
        Storage::disk('public')->makeDirectory('banners');

        $adminId = \App\Models\User::first()->id;

        foreach ($this->banners as $data) {
            Banner::create([
                'user_id'         => $adminId,
                'title'           => $data['title'],
                'description'     => $data['description'],
                'redirect_url'    => null,
                'filename'        => $data['filename'],
                'active'          => 1,
                'published_start' => Carbon::now(),
                'published_end'   => Carbon::now()->addYear(),
            ]);
        }
    }
}
