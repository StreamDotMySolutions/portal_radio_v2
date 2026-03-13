<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use App\Models\StationCategory;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Rebuild the nested set tree for all categories
        // Get all categories ordered by ID (preserves insertion order)
        $categories = StationCategory::query()
            ->whereNull('parent_id')
            ->orderBy('id')
            ->get();

        foreach ($categories as $index => $category) {
            // Set lft = (index * 2) + 1
            // Set rgt = (index * 2) + 2
            // This creates a proper nested set for root-level items
            DB::table('station_categories')
                ->where('id', $category->id)
                ->update([
                    '_lft' => ($index * 2) + 1,
                    '_rgt' => ($index * 2) + 2,
                ]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Reset nested set columns
        DB::table('station_categories')->update([
            '_lft' => 0,
            '_rgt' => 0,
        ]);
    }
};
