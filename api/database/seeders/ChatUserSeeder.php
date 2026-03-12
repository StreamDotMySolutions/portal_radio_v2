<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ChatUser;
use Illuminate\Support\Facades\Hash;

class ChatUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = [
            ['username' => 'azril_nazli', 'email' => 'azril@example.com', 'password' => Hash::make('password123'), 'color' => '#FF6B6B'],
            ['username' => 'dina_malik', 'email' => 'dina@example.com', 'password' => Hash::make('password123'), 'color' => '#4ECDC4'],
            ['username' => 'rapi_santoso', 'email' => 'rapi@example.com', 'password' => Hash::make('password123'), 'color' => '#45B7D1'],
            ['username' => 'siti_nurhaliza', 'email' => 'siti@example.com', 'password' => Hash::make('password123'), 'color' => '#FFA07A'],
            ['username' => 'ahmad_radzi', 'email' => 'ahmad@example.com', 'password' => Hash::make('password123'), 'color' => '#98D8C8'],
            ['username' => 'farah_lina', 'email' => 'farah@example.com', 'password' => Hash::make('password123'), 'color' => '#F7DC6F'],
            ['username' => 'hassan_786', 'email' => 'hassan@example.com', 'password' => Hash::make('password123'), 'color' => '#BB8FCE'],
            ['username' => 'maya_ismail', 'email' => 'maya@example.com', 'password' => Hash::make('password123'), 'color' => '#85C1E2'],
        ];

        foreach ($users as $user) {
            ChatUser::firstOrCreate(
                ['username' => $user['username']],
                [
                    'email' => $user['email'],
                    'password' => $user['password'],
                    'color' => $user['color'],
                    'email_verified_at' => now(),
                    'full_name' => ucfirst(str_replace('_', ' ', $user['username'])),
                ]
            );
        }

        $this->command->info('Chat users populated successfully!');
    }
}
