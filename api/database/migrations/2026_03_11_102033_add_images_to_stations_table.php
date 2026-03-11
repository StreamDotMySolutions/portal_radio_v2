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
            $table->string('slug')->unique()->nullable()->after('title');
            $table->string('thumbnail_filename')->nullable()->after('active');
            $table->string('banner_filename')->nullable()->after('thumbnail_filename');
            $table->string('accent_color')->nullable()->after('banner_filename');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('stations', function (Blueprint $table) {
            $table->dropColumn(['slug', 'thumbnail_filename', 'banner_filename', 'accent_color']);
        });
    }
};
