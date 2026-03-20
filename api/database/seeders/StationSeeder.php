<?php

namespace Database\Seeders;

use App\Models\Station;
use App\Models\StationCategory;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;

class StationSeeder extends Seeder
{
    private array $nasionalStations = [
        [
            'slug' => 'nasional-fm',
            'title' => 'NASIONALfm',
            'description' => 'NASIONALfm adalah stesen radio utama RTM yang menyiarkan pelbagai rancangan muzik, berita, dan hiburan untuk seluruh rakyat Malaysia. Stesen ini menjadi pilihan utama pendengar sejak penubuhannya.',
            'frequency' => '88.5 FM',
            'rtmklik_player_url' => 'https://rtmklik-radio-player.s3.ap-southeast-1.amazonaws.com/index.html?radio=NASIONAL_FM',
            'facebook_url' => 'https://facebook.com/RTMMalaysia',
            'x_url' => 'https://twitter.com/RTMMalaysia',
            'instagram_url' => 'https://instagram.com/RTMMalaysia',
            'youtube_url' => 'https://youtube.com/RTMMalaysia',
            'accent_color' => '#3F3F8F',
        ],
        [
            'slug' => 'kl-fm',
            'title' => 'KLfm',
            'description' => 'KLfm adalah stesen radio berbahasa Inggeris yang menyiarkan muzik pop antarabangsa dan tempatan. Stesen ini menjadi pilihan pendengar muda di Kuala Lumpur dan sekitarnya.',
            'frequency' => '97.2 FM',
            'rtmklik_player_url' => 'https://rtmklik-radio-player.s3.ap-southeast-1.amazonaws.com/index.html?radio=KL_FM',
            'facebook_url' => 'https://facebook.com/RTMMalaysia',
            'x_url' => 'https://twitter.com/RTMMalaysia',
            'instagram_url' => 'https://instagram.com/RTMMalaysia',
            'youtube_url' => 'https://youtube.com/RTMMalaysia',
            'accent_color' => '#0284C7',
        ],
        [
            'slug' => 'asyik-fm',
            'title' => 'AsyikFM',
            'description' => 'AsyikFM membawa irama Malaysia yang paling asyik dan meriah. Stesen ini mengkhususkan muzik tradisional dan moden Malaysia yang membuatkan anda terhibur sepanjang hari.',
            'frequency' => '91.1 FM',
            'rtmklik_player_url' => 'https://rtmklik-radio-player.s3.ap-southeast-1.amazonaws.com/index.html?radio=ASYIK_FM',
            'facebook_url' => 'https://facebook.com/RTMMalaysia',
            'x_url' => 'https://twitter.com/RTMMalaysia',
            'instagram_url' => 'https://instagram.com/RTMMalaysia',
            'youtube_url' => 'https://youtube.com/RTMMalaysia',
            'accent_color' => '#BE185D',
        ],
        [
            'slug' => 'wai-fm',
            'title' => 'WaiFM',
            'description' => 'WaiFM adalah stesen radio RTM yang menyiarkan dalam bahasa Iban dan Kadazan. Stesen ini menghubungkan masyarakat Bumiputera Sarawak dan Sabah melalui muzik dan budaya.',
            'frequency' => 'Pelbagai Frekuensi',
            'rtmklik_player_url' => 'https://rtmklik-radio-player.s3.ap-southeast-1.amazonaws.com/index.html?radio=WAI_FM_IBAN',
            'facebook_url' => 'https://facebook.com/RTMMalaysia',
            'x_url' => 'https://twitter.com/RTMMalaysia',
            'instagram_url' => 'https://instagram.com/RTMMalaysia',
            'youtube_url' => 'https://youtube.com/RTMMalaysia',
            'accent_color' => '#0891B2',
        ],
        [
            'slug' => 'klasik-fm',
            'title' => 'Radio Klasik',
            'description' => 'Radio Klasik menyiarkan muzik klasik dan tradisional Malaysia yang mempesona. Stesen ini memuliakan warisan muzik tempatan dengan lagu-lagu nostalgia dan persembahan orkestra.',
            'frequency' => '89.3 FM',
            'rtmklik_player_url' => 'https://rtmklik-radio-player.s3.ap-southeast-1.amazonaws.com/index.html?radio=RADIO_KLASIK',
            'facebook_url' => 'https://facebook.com/RTMMalaysia',
            'x_url' => 'https://twitter.com/RTMMalaysia',
            'instagram_url' => 'https://instagram.com/RTMMalaysia',
            'youtube_url' => 'https://youtube.com/RTMMalaysia',
            'accent_color' => '#92400E',
        ],
    ];

    private array $negeriStations = [
        [
            'slug' => 'kelantan-fm',
            'title' => 'Kelantan FM',
            'description' => 'Kelantan FM menyiarkan rancangan untuk masyarakat Kelantan dengan budaya dan tradisi tempatan.',
            'frequency' => '102.9 FM',
            'rtmklik_player_url' => 'https://rtmklik-radio-player.s3.ap-southeast-1.amazonaws.com/index.html?radio=KELANTAN_FM',
            'facebook_url' => 'https://facebook.com/RTMMalaysia',
            'instagram_url' => 'https://instagram.com/RTMMalaysia',
            'accent_color' => '#FF5A1F',
        ],
        [
            'slug' => 'johor-fm',
            'title' => 'Johor FM',
            'description' => 'Johor FM adalah suara masyarakat Johor dengan pelbagai rancangan menarik.',
            'frequency' => '101.9 FM',
            'rtmklik_player_url' => 'https://rtmklik-radio-player.s3.ap-southeast-1.amazonaws.com/index.html?radio=JOHOR_FM',
            'facebook_url' => 'https://facebook.com/RTMMalaysia',
            'instagram_url' => 'https://instagram.com/RTMMalaysia',
            'accent_color' => '#059669',
        ],
        [
            'slug' => 'kedah-fm',
            'title' => 'Kedah FM',
            'description' => 'Kedah FM membawa berita dan hiburan untuk rakyat Kedah.',
            'frequency' => '97.5 FM',
            'rtmklik_player_url' => 'https://rtmklik-radio-player.s3.ap-southeast-1.amazonaws.com/index.html?radio=KEDAH_FM',
            'facebook_url' => 'https://facebook.com/RTMMalaysia',
            'instagram_url' => 'https://instagram.com/RTMMalaysia',
            'accent_color' => '#0891B2',
        ],
        [
            'slug' => 'langkawi-fm',
            'title' => 'Langkawi FM',
            'description' => 'Langkawi FM menyiarkan rancangan untuk komuniti di Langkawi dan sekitarnya.',
            'frequency' => 'Pelbagai Frekuensi',
            'rtmklik_player_url' => 'https://rtmklik-radio-player.s3.ap-southeast-1.amazonaws.com/index.html?radio=LANGKAWI_FM',
            'facebook_url' => 'https://facebook.com/RTMMalaysia',
            'instagram_url' => 'https://instagram.com/RTMMalaysia',
            'accent_color' => '#059669',
        ],
        [
            'slug' => 'selangor-fm',
            'title' => 'Selangor FM',
            'description' => 'Selangor FM menyiarkan rancangan untuk komuniti di Selangor.',
            'frequency' => '100.9 FM',
            'rtmklik_player_url' => 'https://rtmklik-radio-player.s3.ap-southeast-1.amazonaws.com/index.html?radio=SELANGOR_FM',
            'facebook_url' => 'https://facebook.com/RTMMalaysia',
            'instagram_url' => 'https://instagram.com/RTMMalaysia',
            'accent_color' => '#D97706',
        ],
        [
            'slug' => 'perak-fm',
            'title' => 'Perak FM',
            'description' => 'Perak FM adalah suara masyarakat Perak dengan rancangan tempatan.',
            'frequency' => '95.6 FM',
            'rtmklik_player_url' => 'https://rtmklik-radio-player.s3.ap-southeast-1.amazonaws.com/index.html?radio=PERAK_FM',
            'facebook_url' => 'https://facebook.com/RTMMalaysia',
            'instagram_url' => 'https://instagram.com/RTMMalaysia',
            'accent_color' => '#7C3AED',
        ],
        [
            'slug' => 'melaka-fm',
            'title' => 'Melaka FM',
            'description' => 'Melaka FM membawa budaya dan warisan Melaka kepada pendengar.',
            'frequency' => '102.3 FM',
            'rtmklik_player_url' => 'https://rtmklik-radio-player.s3.ap-southeast-1.amazonaws.com/index.html?radio=MELAKA_FM',
            'facebook_url' => 'https://facebook.com/RTMMalaysia',
            'instagram_url' => 'https://instagram.com/RTMMalaysia',
            'accent_color' => '#DC2626',
        ],
        [
            'slug' => 'mutiara-fm',
            'title' => 'Mutiara FM',
            'description' => 'Mutiara FM adalah stesen radio RTM untuk masyarakat Pulau Pinang yang menyiarkan rancangan hiburan, berita, dan budaya tempatan.',
            'frequency' => '99.8 FM',
            'rtmklik_player_url' => 'https://rtmklik-radio-player.s3.ap-southeast-1.amazonaws.com/index.html?radio=MUTIARA_FM',
            'facebook_url' => 'https://facebook.com/RTMMalaysia',
            'instagram_url' => 'https://instagram.com/RTMMalaysia',
            'accent_color' => '#0891B2',
        ],
        [
            'slug' => 'terengganu-fm',
            'title' => 'Terengganu FM',
            'description' => 'Terengganu FM menyiarkan rancangan untuk masyarakat Terengganu.',
            'frequency' => '88.7 FM',
            'rtmklik_player_url' => 'https://rtmklik-radio-player.s3.ap-southeast-1.amazonaws.com/index.html?radio=TERENGGANU_FM',
            'facebook_url' => 'https://facebook.com/RTMMalaysia',
            'instagram_url' => 'https://instagram.com/RTMMalaysia',
            'accent_color' => '#EA580C',
        ],
        [
            'slug' => 'negeri-sembilan-fm',
            'title' => 'Negeri Sembilan FM',
            'description' => 'Negeri Sembilan FM membawa budaya Minang dan tradisi tempatan.',
            'frequency' => '92.6 FM',
            'rtmklik_player_url' => 'https://rtmklik-radio-player.s3.ap-southeast-1.amazonaws.com/index.html?radio=NEGERI_FM',
            'facebook_url' => 'https://facebook.com/RTMMalaysia',
            'instagram_url' => 'https://instagram.com/RTMMalaysia',
            'accent_color' => '#BE185D',
        ],
        [
            'slug' => 'pahang-fm',
            'title' => 'Pahang FM',
            'description' => 'Pahang FM adalah suara rakyat Pahang dengan rancangan menarik.',
            'frequency' => '104.1 FM',
            'rtmklik_player_url' => 'https://rtmklik-radio-player.s3.ap-southeast-1.amazonaws.com/index.html?radio=PAHANG_FM',
            'facebook_url' => 'https://facebook.com/RTMMalaysia',
            'instagram_url' => 'https://instagram.com/RTMMalaysia',
            'accent_color' => '#059669',
        ],
        [
            'slug' => 'perlis-fm',
            'title' => 'Perlis FM',
            'description' => 'Perlis FM menyiarkan rancangan untuk masyarakat Perlis.',
            'frequency' => '102.9 FM',
            'rtmklik_player_url' => 'https://rtmklik-radio-player.s3.ap-southeast-1.amazonaws.com/index.html?radio=PERLIS_FM',
            'facebook_url' => 'https://facebook.com/RTMMalaysia',
            'instagram_url' => 'https://instagram.com/RTMMalaysia',
            'accent_color' => '#0284C7',
        ],
        [
            'slug' => 'labuan-fm',
            'title' => 'Labuan FM',
            'description' => 'Labuan FM membawa berita dan hiburan untuk Wilayah Persekutuan Labuan.',
            'frequency' => '103.7 FM',
            'rtmklik_player_url' => 'https://rtmklik-radio-player.s3.ap-southeast-1.amazonaws.com/index.html?radio=LABUAN_FM',
            'facebook_url' => 'https://facebook.com/RTMMalaysia',
            'instagram_url' => 'https://instagram.com/RTMMalaysia',
            'accent_color' => '#3F3F8F',
        ],
        [
            'slug' => 'sarawak-fm',
            'title' => 'Sarawak FM',
            'description' => 'Sarawak FM adalah stesen radio RTM untuk masyarakat Sarawak.',
            'frequency' => 'Pelbagai Frekuensi',
            'rtmklik_player_url' => 'https://rtmklik-radio-player.s3.ap-southeast-1.amazonaws.com/index.html?radio=SARAWAK_FM',
            'facebook_url' => 'https://facebook.com/RTMMalaysia',
            'instagram_url' => 'https://instagram.com/RTMMalaysia',
            'accent_color' => '#D97706',
        ],
        [
            'slug' => 'sabah-fm',
            'title' => 'Sabah FM',
            'description' => 'Sabah FM menyiarkan rancangan untuk masyarakat Sabah.',
            'frequency' => 'Pelbagai Frekuensi',
            'rtmklik_player_url' => 'https://rtmklik-radio-player.s3.ap-southeast-1.amazonaws.com/index.html?radio=SABAH_FM',
            'facebook_url' => 'https://facebook.com/RTMMalaysia',
            'instagram_url' => 'https://instagram.com/RTMMalaysia',
            'accent_color' => '#7C3AED',
        ],
        [
            'slug' => 'sandakan-fm',
            'title' => 'Sandakan FM',
            'description' => 'Sandakan FM membawa berita dan hiburan tempatan untuk Sandakan.',
            'frequency' => '90.1 FM',
            'rtmklik_player_url' => 'https://rtmklik-radio-player.s3.ap-southeast-1.amazonaws.com/index.html?radio=SANDAKAN_FM',
            'facebook_url' => 'https://facebook.com/RTMMalaysia',
            'instagram_url' => 'https://instagram.com/RTMMalaysia',
            'accent_color' => '#DC2626',
        ],
        [
            'slug' => 'limbang-fm',
            'title' => 'Limbang FM',
            'description' => 'Limbang FM adalah suara masyarakat Limbang dan sekitarnya.',
            'frequency' => '104.9 FM',
            'rtmklik_player_url' => 'https://rtmklik-radio-player.s3.ap-southeast-1.amazonaws.com/index.html?radio=LIMBANG',
            'facebook_url' => 'https://facebook.com/RTMMalaysia',
            'instagram_url' => 'https://instagram.com/RTMMalaysia',
            'accent_color' => '#EA580C',
        ],
        [
            'slug' => 'bintulu-fm',
            'title' => 'Bintulu FM',
            'description' => 'Bintulu FM menyiarkan rancangan untuk komuniti Bintulu.',
            'frequency' => '97.5 FM',
            'rtmklik_player_url' => 'https://rtmklik-radio-player.s3.ap-southeast-1.amazonaws.com/index.html?radio=BINTULU_FM',
            'facebook_url' => 'https://facebook.com/RTMMalaysia',
            'instagram_url' => 'https://instagram.com/RTMMalaysia',
            'accent_color' => '#BE185D',
        ],
        [
            'slug' => 'keningau-fm',
            'title' => 'Keningau FM',
            'description' => 'Keningau FM membawa berita dan hiburan untuk Keningau dan pedalaman Sabah.',
            'frequency' => '98.4 FM',
            'rtmklik_player_url' => 'https://rtmklik-radio-player.s3.ap-southeast-1.amazonaws.com/index.html?radio=KENINGAU_FM',
            'facebook_url' => 'https://facebook.com/RTMMalaysia',
            'instagram_url' => 'https://instagram.com/RTMMalaysia',
            'accent_color' => '#059669',
        ],
        [
            'slug' => 'miri-fm',
            'title' => 'Miri FM',
            'description' => 'Miri FM adalah stesen radio untuk masyarakat Miri dan utara Sarawak.',
            'frequency' => '95.7 FM',
            'rtmklik_player_url' => 'https://rtmklik-radio-player.s3.ap-southeast-1.amazonaws.com/index.html?radio=MIRI_FM',
            'facebook_url' => 'https://facebook.com/RTMMalaysia',
            'instagram_url' => 'https://instagram.com/RTMMalaysia',
            'accent_color' => '#0284C7',
        ],
        [
            'slug' => 'red-fm',
            'title' => 'Red FM',
            'description' => 'Red FM menyiarkan muzik dan hiburan dengan gaya tersendiri.',
            'frequency' => 'Pelbagai Frekuensi',
            'rtmklik_player_url' => 'https://rtmklik-radio-player.s3.ap-southeast-1.amazonaws.com/index.html?radio=RED_FM',
            'facebook_url' => 'https://facebook.com/RTMMalaysia',
            'instagram_url' => 'https://instagram.com/RTMMalaysia',
            'accent_color' => '#3F3F8F',
        ],
        [
            'slug' => 'sabah-v-fm',
            'title' => 'Sabah V FM',
            'description' => 'Sabah V FM membawa suara masyarakat Sabah dengan rancangan pelbagai.',
            'frequency' => 'Pelbagai Frekuensi',
            'rtmklik_player_url' => 'https://rtmklik-radio-player.s3.ap-southeast-1.amazonaws.com/index.html?radio=SABAH_VFM',
            'facebook_url' => 'https://facebook.com/RTMMalaysia',
            'instagram_url' => 'https://instagram.com/RTMMalaysia',
            'accent_color' => '#D97706',
        ],
        [
            'slug' => 'sibu-fm',
            'title' => 'Sibu FM',
            'description' => 'Sibu FM adalah stesen radio untuk masyarakat Sibu dan sekitarnya.',
            'frequency' => '87.6 FM',
            'rtmklik_player_url' => 'https://rtmklik-radio-player.s3.ap-southeast-1.amazonaws.com/index.html?radio=SIBU_FM',
            'facebook_url' => 'https://facebook.com/RTMMalaysia',
            'instagram_url' => 'https://instagram.com/RTMMalaysia',
            'accent_color' => '#7C3AED',
        ],
        [
            'slug' => 'sri-aman-fm',
            'title' => 'Sri Aman FM',
            'description' => 'Sri Aman FM menyiarkan rancangan untuk komuniti Sri Aman.',
            'frequency' => '89.5 FM',
            'rtmklik_player_url' => 'https://rtmklik-radio-player.s3.ap-southeast-1.amazonaws.com/index.html?radio=SRIAMAN_FM',
            'facebook_url' => 'https://facebook.com/RTMMalaysia',
            'instagram_url' => 'https://instagram.com/RTMMalaysia',
            'accent_color' => '#DC2626',
        ],
        [
            'slug' => 'tawau-fm',
            'title' => 'Tawau FM',
            'description' => 'Tawau FM membawa berita dan hiburan untuk masyarakat Tawau.',
            'frequency' => '100.1 FM',
            'rtmklik_player_url' => 'https://rtmklik-radio-player.s3.ap-southeast-1.amazonaws.com/index.html?radio=TAWAU_FM',
            'facebook_url' => 'https://facebook.com/RTMMalaysia',
            'instagram_url' => 'https://instagram.com/RTMMalaysia',
            'accent_color' => '#EA580C',
        ],
        [
            'slug' => 'wai-segulai-sejalai',
            'title' => 'WAI Segulai Sejalai',
            'description' => 'WAI Segulai Sejalai menyiarkan rancangan dalam bahasa Iban untuk komuniti di Sarawak.',
            'frequency' => 'Pelbagai Frekuensi',
            'rtmklik_player_url' => 'https://rtmklik-radio-player.s3.ap-southeast-1.amazonaws.com/index.html?radio=WAI_FM_IBAN',
            'facebook_url' => 'https://facebook.com/RTMMalaysia',
            'instagram_url' => 'https://instagram.com/RTMMalaysia',
            'accent_color' => '#BE185D',
        ],
        [
            'slug' => 'wai-gerak-bisamah',
            'title' => 'WAI Gerak Bisamah',
            'description' => 'WAI Gerak Bisamah menyiarkan rancangan dalam bahasa Kadazan untuk komuniti di Sabah.',
            'frequency' => 'Pelbagai Frekuensi',
            'rtmklik_player_url' => 'https://rtmklik-radio-player.s3.ap-southeast-1.amazonaws.com/index.html?radio=WAI_FM_BK',
            'facebook_url' => 'https://facebook.com/RTMMalaysia',
            'instagram_url' => 'https://instagram.com/RTMMalaysia',
            'accent_color' => '#059669',
        ],
    ];

    public function run(): void
    {
        // Clear existing stations
        Station::query()->delete();

        $adminId = \App\Models\User::first()->id;

        // Get category IDs
        $nasionalCat = StationCategory::where('slug', 'nasional')->first();
        $negeriCat = StationCategory::where('slug', 'negeri')->first();

        foreach ($this->nasionalStations as $data) {
            $image = $data['slug'] . '.jpg';

            Station::create(array_merge($data, [
                'user_id' => $adminId,
                'station_category_id' => $nasionalCat->id,
                'active' => 1,
                'player_type' => 'iframe',
                'stream_url' => null,
                'thumbnail_filename' => $image,
                'banner_filename' => $image,
            ]));
        }

        foreach ($this->negeriStations as $data) {
            $image = $data['slug'] . '.jpg';

            Station::create(array_merge($data, [
                'user_id' => $adminId,
                'station_category_id' => $negeriCat->id,
                'active' => 1,
                'player_type' => 'iframe',
                'stream_url' => null,
                'thumbnail_filename' => $image,
                'banner_filename' => $image,
            ]));
        }

        // Rebuild nested set tree for all stations
        Station::fixTree();
    }
}
