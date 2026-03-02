<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('analytics_events', function (Blueprint $table) {
            $table->id();
            $table->string('session_id', 36)->index();
            $table->string('event_type', 50)->index();   // pageview, search
            $table->string('page_type', 50)->nullable(); // home, article, listing, directory
            $table->unsignedBigInteger('reference_id')->nullable();
            $table->string('reference_title', 255)->nullable();
            $table->string('device_type', 20)->nullable(); // mobile, tablet, desktop
            $table->string('referrer', 500)->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('analytics_events');
    }
};
