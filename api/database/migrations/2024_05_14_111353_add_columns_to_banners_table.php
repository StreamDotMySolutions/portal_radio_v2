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
        Schema::table('banners', function (Blueprint $table) {
            $table->date('published_start')->default(Carbon::now())->after('filename');  // Set default value to current date and time
            $table->date('published_end')->nullable();  // datetime
            $table->boolean('active')->default(false); // is active ?
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('banners', function (Blueprint $table) {
            $table->dropColumn('published_start');
            $table->dropColumn('published_end');
            $table->dropColumn('active');
        });
    }
};
