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
        Directory::create(['name' => 'angkasapuri','type' => 'folder']);
        Directory::create(['name' => 'negeri', 'type' => 'folder']);
    }
}
