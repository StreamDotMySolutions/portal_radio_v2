<?php

namespace App\Services;

use App\Models\Station;
use App\Models\StationListener;
use Illuminate\Support\Facades\DB;

class StationListenerService
{
    public static function heartbeat(string $sessionId, int $stationId): void
    {
        StationListener::updateOrCreate(
            ['session_id' => $sessionId, 'station_id' => $stationId],
            ['last_seen_at' => now()]
        );
    }

    public static function concurrentForStation(int $stationId, int $minutes = 5): int
    {
        return StationListener::where('station_id', $stationId)
            ->where('last_seen_at', '>=', now()->subMinutes($minutes))
            ->distinct('session_id')
            ->count('session_id');
    }

    public static function concurrentAllStations(int $minutes = 5): array
    {
        return StationListener::where('last_seen_at', '>=', now()->subMinutes($minutes))
            ->select('station_id', DB::raw('COUNT(DISTINCT session_id) as listeners'))
            ->groupBy('station_id')
            ->pluck('listeners', 'station_id')
            ->toArray();
    }

    public static function concurrentBySlug(int $minutes = 5): array
    {
        $byId = self::concurrentAllStations($minutes);
        if (empty($byId)) {
            return [];
        }

        $slugs = Station::whereIn('id', array_keys($byId))->pluck('slug', 'id');

        $bySlug = [];
        foreach ($byId as $stationId => $count) {
            if (isset($slugs[$stationId])) {
                $bySlug[$slugs[$stationId]] = $count;
            }
        }

        return $bySlug;
    }

    public static function topListeningNow(int $limit = 10, int $minutes = 5)
    {
        return StationListener::where('last_seen_at', '>=', now()->subMinutes($minutes))
            ->join('stations', 'stations.id', '=', 'station_listeners.station_id')
            ->select(
                'stations.id as station_id',
                'stations.name as station_name',
                'stations.slug as slug',
                DB::raw('COUNT(DISTINCT station_listeners.session_id) as listeners')
            )
            ->groupBy('stations.id', 'stations.name', 'stations.slug')
            ->orderByDesc('listeners')
            ->limit($limit)
            ->get();
    }

    public static function prune(int $olderThanMinutes = 10): int
    {
        return StationListener::where('last_seen_at', '<', now()->subMinutes($olderThanMinutes))->delete();
    }
}
