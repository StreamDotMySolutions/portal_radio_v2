<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\UserProfile;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::create([
            'name'     => 'Administrator',
            'email'    => 'admin@local',
            'password' => Hash::make('password'),
        ]);

        UserProfile::create([
            'user_id' => $user->id,
            'address' => 'Malaysia',
        ]);

        $user->assignRole('admin');
    }
}
