<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('stations', function (Blueprint $table) {
            $table->enum('player_type', ['m3u8', 'iframe'])->default('m3u8')->after('rtmklik_player_url');
            $table->text('stream_url')->nullable()->after('player_type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('stations', function (Blueprint $table) {
            $table->dropColumn(['player_type', 'stream_url']);
        });
    }
};
