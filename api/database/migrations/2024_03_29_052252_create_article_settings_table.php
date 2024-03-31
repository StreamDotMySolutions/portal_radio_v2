<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Carbon\Carbon;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('article_settings', function (Blueprint $table) {
            $table->id();
            $table->integer('user_id');
            $table->integer('article_id'); // article
            
            $table->string('layout')->nullable(); // if type = list, choose the layout style
            $table->string('redirect_url')->nullable(); // url 

            $table->date('published_start')->default(Carbon::now());  // Set default value to current date and time
            $table->date('published_end')->nullable();  // datetime

            $table->boolean('active')->default(false); // is active ?

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('article_settings');
    }
};
