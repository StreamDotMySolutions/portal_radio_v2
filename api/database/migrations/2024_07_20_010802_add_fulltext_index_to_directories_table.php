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
        Schema::table('directories', function (Blueprint $table) {
            // Adding FULLTEXT index
            $table->fullText(['name', 'occupation', 'email', 'phone', 'address']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('directories', function (Blueprint $table) {
            // Dropping FULLTEXT index
            $table->dropFullText(['name', 'occupation', 'email', 'phone', 'address']);
        });
    }
};
