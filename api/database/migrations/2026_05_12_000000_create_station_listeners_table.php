<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('station_listeners', function (Blueprint $table) {
            $table->id();
            $table->string('session_id', 64);
            $table->unsignedBigInteger('station_id');
            $table->timestamp('last_seen_at')->index();
            $table->timestamps();

            $table->unique(['session_id', 'station_id']);
            $table->index('station_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('station_listeners');
    }
};
