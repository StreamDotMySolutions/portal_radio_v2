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
        Schema::create('articles', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->integer('user_id');
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('layout')->nullable();
            $table->boolean('active')->default(0);
            $table->datetime('published_at')->default(Carbon::now());  // Set default value to current date and time
            $table->timestamps();
            $table->nestedSet();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('articles');

        // Schema::table('table', function (Blueprint $table) {
        //     NestedSet::dropColumns($table);
        // });
    }
};
