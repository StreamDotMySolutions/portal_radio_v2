<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('analytics_events', function (Blueprint $table) {
            // Workhorse: every range-scoped event_type filter (~21 queries on the analytics page)
            $table->index(['event_type', 'created_at'], 'ae_evt_created_idx');

            // Top-N tables and page-type-scoped daily charts (~8 queries)
            $table->index(['event_type', 'page_type', 'created_at'], 'ae_evt_page_created_idx');

            // Per-station / per-article lookups (also used by the public frontend's allStationViews)
            $table->index(['reference_id', 'event_type'], 'ae_ref_evt_idx');
        });
    }

    public function down(): void
    {
        Schema::table('analytics_events', function (Blueprint $table) {
            $table->dropIndex('ae_evt_created_idx');
            $table->dropIndex('ae_evt_page_created_idx');
            $table->dropIndex('ae_ref_evt_idx');
        });
    }
};
