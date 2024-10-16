<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Directory;

class DirectorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Directory::truncate();
        Directory::create(['name' => '01__Angkasapuri','type' => 'folder']);
        Directory::create(['name' => '02__Negeri', 'type' => 'folder']);
    }
}
