<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('stations', function (Blueprint $table) {
            $table->string('contact_phone')->nullable()->after('tiktok_url');
            $table->string('contact_email')->nullable()->after('contact_phone');
            $table->text('contact_address')->nullable()->after('contact_email');
        });
    }

    public function down(): void
    {
        Schema::table('stations', function (Blueprint $table) {
            $table->dropColumn(['contact_phone', 'contact_email', 'contact_address']);
        });
    }
};
