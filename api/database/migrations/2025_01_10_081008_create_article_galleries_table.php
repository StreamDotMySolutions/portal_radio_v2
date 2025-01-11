<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Kalnoy\Nestedset\NestedSet; // Kalnoy nested Set

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('article_galleries', function (Blueprint $table) {
            $table->id();
            $table->integer('user_id')->nullable();
            $table->integer('article_data_id')->nullable();
            $table->string('filename')->nullable();
            $table->integer('filesize')->nullable();
            $table->nestedSet(); // Kalnoy nestedset
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('article_galleries');
    }
};
