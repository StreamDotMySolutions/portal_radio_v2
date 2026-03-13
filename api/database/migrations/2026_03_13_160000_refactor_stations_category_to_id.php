<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('stations', function (Blueprint $table) {
            // Add new station_category_id column
            $table->foreignId('station_category_id')->nullable()->after('user_id');
        });

        // Normalise underscore slugs to hyphens (old enum values used underscores)
        DB::statement("UPDATE stations SET category = REPLACE(category, '_', '-') WHERE category LIKE '%\_%'");

        // Migrate data from category slug to station_category_id
        DB::statement('
            UPDATE stations s
            JOIN station_categories sc ON s.category = sc.slug
            SET s.station_category_id = sc.id
        ');

        // Make station_category_id NOT NULL after data migration
        Schema::table('stations', function (Blueprint $table) {
            $table->foreignId('station_category_id')->nullable(false)->change();
            $table->foreign('station_category_id')
                ->references('id')
                ->on('station_categories')
                ->cascadeOnUpdate()
                ->restrictOnDelete();
        });

        // Drop old foreign key and category column
        Schema::table('stations', function (Blueprint $table) {
            $table->dropForeign(['category']);
            $table->dropColumn('category');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('stations', function (Blueprint $table) {
            $table->dropForeign(['station_category_id']);
            $table->dropColumn('station_category_id');
        });

        Schema::table('stations', function (Blueprint $table) {
            $table->string('category', 50)->after('user_id');
            $table->foreign('category')
                ->references('slug')
                ->on('station_categories')
                ->cascadeOnUpdate()
                ->restrictOnDelete();
        });
    }
};
