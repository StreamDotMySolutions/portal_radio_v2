<?php

namespace Database\Seeders;

use App\Models\Banner;
use Carbon\Carbon;
use GuzzleHttp\Client;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class BannerSeeder extends Seeder
{
    private array $banners = [
        ['title' => 'Selamat Datang ke RTM',           'description' => 'Radio Televisyen Malaysia — Suara Rasmi Negara'],
        ['title' => 'Siaran Langsung 24 Jam',           'description' => 'Nikmati siaran langsung tanpa henti di saluran RTM'],
        ['title' => 'RTM Anugerah Seni 2025',           'description' => 'Malam penghargaan seni budaya negara'],
        ['title' => 'Berita Terkini RTM',               'description' => 'Ikuti perkembangan berita semasa dari seluruh Malaysia'],
        ['title' => 'Program Kanak-Kanak',              'description' => 'Hiburan mendidik untuk generasi muda Malaysia'],
        ['title' => 'Sukan Malaysia',                   'description' => 'Liputan sukan penuh dari seluruh dunia'],
        ['title' => 'Dokumentari Alam Semula Jadi',     'description' => 'Terokai keindahan alam nusantara bersama RTM'],
        ['title' => 'Muzik Malaysia',                   'description' => 'Lagu-lagu terbaik dari artis tempatan dan antarabangsa'],
        ['title' => 'Forum Perdana',                    'description' => 'Perbincangan isu semasa bersama pakar'],
        ['title' => 'Rancangan Hiburan Minggu Ini',     'description' => 'Jangan lepaskan hiburan terbaik hujung minggu'],
    ];

    public function run(): void
    {
        Storage::disk('public')->makeDirectory('banners');

        $client = new Client(['timeout' => 30, 'verify' => false]);
        $adminId = \App\Models\User::first()->id;

        foreach ($this->banners as $index => $data) {
            $seed    = $index + 1;
            $slug    = Str::slug($data['title']);
            $ts      = 1700000000 + $index;
            $filename = "{$ts}-{$slug}.jpg";
            $path     = storage_path("app/public/banners/{$filename}");

            // Download from picsum (1200×400 carousel size, seeded for consistency)
            try {
                $client->get("https://picsum.photos/seed/{$seed}/1200/400", [
                    'sink' => $path,
                ]);
            } catch (\Exception $e) {
                $this->command->warn("Could not download image for banner #{$seed}: {$e->getMessage()}");
                $filename = null;
            }

            Banner::create([
                'user_id'         => $adminId,
                'title'           => $data['title'],
                'description'     => $data['description'],
                'redirect_url'    => null,
                'filename'        => $filename,
                'active'          => 1,
                'published_start' => Carbon::now(),
                'published_end'   => Carbon::now()->addYear(),
            ]);
        }
    }
}
