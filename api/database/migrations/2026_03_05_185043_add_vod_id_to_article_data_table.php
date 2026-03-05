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
        Schema::table('article_data', function (Blueprint $table) {
            $table->unsignedBigInteger('vod_id')->nullable()->after('contents');
            $table->string('video_poster')->nullable()->after('vod_id');
        });
    }

    public function down(): void
    {
        Schema::table('article_data', function (Blueprint $table) {
            $table->dropColumn(['vod_id', 'video_poster']);
        });
    }
};
