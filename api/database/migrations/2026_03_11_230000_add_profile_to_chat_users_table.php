<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('chat_users', function (Blueprint $table) {
            $table->timestamp('email_verified_at')->nullable()->after('password');
            $table->string('full_name', 100)->nullable()->after('color');
            $table->enum('gender', ['lelaki', 'perempuan'])->nullable()->after('full_name');
            $table->string('location', 100)->nullable()->after('gender');
            $table->string('hobby', 255)->nullable()->after('location');
            $table->text('about_me')->nullable()->after('hobby');
            $table->string('avatar_filename')->nullable()->after('about_me');
            $table->string('facebook_url', 255)->nullable()->after('avatar_filename');
            $table->string('instagram_url', 255)->nullable()->after('facebook_url');
            $table->string('twitter_url', 255)->nullable()->after('instagram_url');
            $table->string('tiktok_url', 255)->nullable()->after('twitter_url');
            $table->string('youtube_url', 255)->nullable()->after('tiktok_url');
        });
    }

    public function down(): void
    {
        Schema::table('chat_users', function (Blueprint $table) {
            $table->dropColumn([
                'email_verified_at', 'full_name', 'gender', 'location', 'hobby',
                'about_me', 'avatar_filename', 'facebook_url', 'instagram_url',
                'twitter_url', 'tiktok_url', 'youtube_url',
            ]);
        });
    }
};
