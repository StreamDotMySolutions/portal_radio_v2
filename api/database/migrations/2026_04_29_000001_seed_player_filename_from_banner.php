<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

return new class extends Migration
{
    public function up(): void
    {
        $rows = DB::table('stations')
            ->whereNotNull('banner_filename')
            ->whereNull('player_filename')
            ->select('id', 'banner_filename')
            ->get();

        foreach ($rows as $row) {
            $sourcePath = "stations/{$row->banner_filename}";

            if (!Storage::disk('public')->exists($sourcePath)) {
                Log::warning("seed_player_filename_from_banner: source missing for station {$row->id}: {$sourcePath}");
                continue;
            }

            $name = pathinfo($row->banner_filename, PATHINFO_FILENAME);
            $ext = pathinfo($row->banner_filename, PATHINFO_EXTENSION);
            $newFilename = time() . '-' . $row->id . '-player-' . Str::slug($name) . ($ext ? '.' . $ext : '');

            Storage::disk('public')->copy($sourcePath, "stations/{$newFilename}");

            DB::table('stations')
                ->where('id', $row->id)
                ->update(['player_filename' => $newFilename]);
        }
    }

    public function down(): void
    {
        $rows = DB::table('stations')
            ->whereNotNull('player_filename')
            ->where('player_filename', 'like', '%-player-%')
            ->select('id', 'player_filename')
            ->get();

        foreach ($rows as $row) {
            Storage::disk('public')->delete("stations/{$row->player_filename}");

            DB::table('stations')
                ->where('id', $row->id)
                ->update(['player_filename' => null]);
        }
    }
};
