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
        Schema::table('stations', function (Blueprint $table) {
            $table->unsignedInteger('_lft')->default(0)->after('user_id');
            $table->unsignedInteger('_rgt')->default(0)->after('_lft');
            $table->unsignedBigInteger('parent_id')->nullable()->after('_rgt');
            $table->foreign('parent_id')->references('id')->on('stations')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('stations', function (Blueprint $table) {
            $table->dropForeign(['parent_id']);
            $table->dropColumn(['_lft', '_rgt', 'parent_id']);
        });
    }
};
