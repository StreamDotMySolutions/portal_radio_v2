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
        Schema::table('station_categories', function (Blueprint $table) {
            $table->unsignedInteger('_lft')->default(0);
            $table->unsignedInteger('_rgt')->default(0);
            $table->unsignedInteger('parent_id')->nullable();
            $table->dropColumn('sort_order');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('station_categories', function (Blueprint $table) {
            $table->dropColumn(['_lft', '_rgt', 'parent_id']);
            $table->unsignedInteger('sort_order')->default(0);
        });
    }
};
