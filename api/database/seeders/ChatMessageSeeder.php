<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ChatUser;
use App\Models\ChatMessage;

class ChatMessageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get all chat users
        $users = ChatUser::all();

        if ($users->isEmpty()) {
            $this->command->info('No chat users found. Please run ChatUserSeeder first.');
            return;
        }

        $messages = [
            'Halo semua! 👋',
            'Apa khabar?',
            'Ini adalah aplikasi chat yang menarik!',
            'Siapa yang dengar radio hari ini?',
            'Lagu favorit saya baru diputar! 🎵',
            'Adakah yang tahu lagu apa ini?',
            'Saya suka program ini!',
            'Radio adalah kehidupan saya',
            'Siapa DJ favorit anda?',
            'Station mana yang paling bagus?',
            'Halo teman-teman! Apa berita?',
            'Saya baru mendengarkan musik terbaru',
            'Ini sangat bagus! Saya suka!',
            'Boleh tanya sesuatu?',
            'Terima kasih atas musik yang bagus',
            'Saya nonton live streaming hari ini',
            'Siapa yang melihat konser kemarin?',
            'Musik ini sangat segar!',
            'Sepertinya seru hari ini di radio',
            'Ini adalah hari yang baik untuk mendengarkan musik',
            'Bagimu semua yang mendengarkan, hi!',
            'Lagu ini sangat addictive!',
            'Saya menunggu lagu berikutnya',
            'Mantap! Musik yang bagus',
            'Adik saya juga suka radio ini',
        ];

        // Create messages
        for ($i = 0; $i < 30; $i++) {
            $user = $users->random();
            $message = $messages[array_rand($messages)];
            $hoursAgo = rand(0, 48);

            ChatMessage::create([
                'chat_user_id' => $user->id,
                'message' => $message,
                'created_at' => now()->subHours($hoursAgo),
            ]);
        }

        $this->command->info('Chat messages populated successfully!');
    }
}
