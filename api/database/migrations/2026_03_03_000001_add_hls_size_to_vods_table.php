<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('vods', function (Blueprint $table) {
            $table->unsignedBigInteger('hls_size')->nullable()->after('filesize');
        });
    }

    public function down(): void
    {
        Schema::table('vods', function (Blueprint $table) {
            $table->dropColumn('hls_size');
        });
    }
};
