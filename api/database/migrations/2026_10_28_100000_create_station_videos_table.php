<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('station_videos', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->foreignId('station_id')->constrained('stations')->cascadeOnDelete();
            $table->integer('user_id')->nullable();
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('source_filename')->nullable();   // upload awaiting transcode; removed once ready
            $table->string('version')->nullable();           // HLS output directory currently served
            $table->enum('status', ['pending', 'processing', 'ready', 'failed'])->default('pending');
            $table->text('error')->nullable();
            $table->float('duration')->default(0);
            $table->unsignedInteger('width')->default(0);
            $table->unsignedInteger('height')->default(0);
            $table->json('renditions')->nullable();
            $table->unsignedBigInteger('hls_size')->default(0);
            $table->boolean('active')->default(true);
            $table->timestamps();
            $table->nestedSet(); // Kalnoy nestedset, scoped per station
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('station_videos');
    }
};
