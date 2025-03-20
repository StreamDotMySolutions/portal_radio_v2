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
        Schema::table('article_settings', function (Blueprint $table) {
            $table->date('published_start')->default(now())->change(); // Make it nullable
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('article_settings', function (Blueprint $table) {
            $table->date('published_start')->default(now())->change(); // Revert if needed
        });
    }
};
