<?php

namespace App\Services;

use App\Models\AnalyticsEvent;
use App\Models\Station;
use Illuminate\Support\Facades\DB;

class AnalyticsService
{
    private static function applyDateRange($query, $from = null, $to = null)
    {
        if ($from) $query->where('created_at', '>=', $from);
        if ($to)   $query->where('created_at', '<=', $to);
        return $query;
    }

    public static function summary(): array
    {
        return [
            'today'    => AnalyticsEvent::where('event_type', 'pageview')
                              ->whereDate('created_at', today())
                              ->count(),
            'week'     => AnalyticsEvent::where('event_type', 'pageview')
                              ->where('created_at', '>=', now()->startOfWeek())
                              ->count(),
            'month'    => AnalyticsEvent::where('event_type', 'pageview')
                              ->where('created_at', '>=', now()->startOfMonth())
                              ->count(),
            'visitors' => AnalyticsEvent::where('created_at', '>=', now()->subDays(30))
                              ->distinct('session_id')
                              ->count('session_id'),
        ];
    }

    public static function topArticles(int $limit = 10, $from = null, $to = null)
    {
        $query = AnalyticsEvent::where('event_type', 'pageview')
            ->whereNotNull('reference_title');
        self::applyDateRange($query, $from, $to);
        return $query->select('reference_id', 'reference_title', 'page_type', DB::raw('count(*) as views'))
            ->groupBy('reference_id', 'reference_title', 'page_type')
            ->orderByDesc('views')
            ->limit($limit)
            ->get();
    }

    public static function topStations(int $limit = 10, $from = null, $to = null)
    {
        $query = AnalyticsEvent::where('event_type', 'pageview')
            ->where('page_type', 'station')
            ->whereNotNull('reference_id');
        self::applyDateRange($query, $from, $to);
        return $query->select('reference_id', 'reference_title', DB::raw('count(*) as views'))
            ->groupBy('reference_id', 'reference_title')
            ->orderByDesc('views')
            ->limit($limit)
            ->get();
    }

    public static function topSearches(int $limit = 10, $from = null, $to = null)
    {
        $query = AnalyticsEvent::where('event_type', 'search')
            ->whereNotNull('reference_title');
        self::applyDateRange($query, $from, $to);
        return $query->select('reference_title as query', DB::raw('count(*) as count'))
            ->groupBy('reference_title')
            ->orderByDesc('count')
            ->limit($limit)
            ->get();
    }

    public static function topDirectorySearches(int $limit = 10, $from = null, $to = null)
    {
        $query = AnalyticsEvent::where('event_type', 'search')
            ->where('page_type', 'directory')
            ->whereNotNull('reference_title');
        self::applyDateRange($query, $from, $to);
        return $query->select('reference_title as query', DB::raw('count(*) as count'))
            ->groupBy('reference_title')
            ->orderByDesc('count')
            ->limit($limit)
            ->get();
    }

    public static function dailyViews($from = null, $to = null)
    {
        $query = AnalyticsEvent::where('event_type', 'pageview');
        self::applyDateRange($query, $from ?: now()->subDays(29)->startOfDay(), $to);
        return $query->select(DB::raw('DATE(created_at) as date'), DB::raw('count(*) as views'))
            ->groupBy(DB::raw('DATE(created_at)'))
            ->orderBy('date')
            ->get();
    }

    public static function topDownloads(int $limit = 10, $from = null, $to = null)
    {
        $query = AnalyticsEvent::where('event_type', 'download')
            ->whereNotNull('reference_title');
        self::applyDateRange($query, $from, $to);
        return $query->select('reference_title as filename', 'page_type', DB::raw('count(*) as count'))
            ->groupBy('reference_title', 'page_type')
            ->orderByDesc('count')
            ->limit($limit)
            ->get();
    }

    public static function deviceSplit($from = null, $to = null)
    {
        $query = AnalyticsEvent::where('event_type', 'pageview');
        self::applyDateRange($query, $from, $to);
        return $query->select('device_type', DB::raw('count(*) as count'))
            ->groupBy('device_type')
            ->orderByDesc('count')
            ->get();
    }

    /**
     * Get player play count for a specific station
     * Counts both livestream_play and player_play events
     * @param int|string $stationId Station ID (reference_id in analytics)
     */
    public static function stationViews($stationId)
    {
        return AnalyticsEvent::whereIn('event_type', ['livestream_play', 'player_play'])
            ->where('page_type', 'station')
            ->where('reference_id', $stationId)
            ->count();
    }

    /**
     * Get player play counts for all stations, keyed by slug
     * Counts both livestream_play and player_play events
     */
    public static function allStationViews(): array
    {
        $hitsByStationId = AnalyticsEvent::whereIn('event_type', ['livestream_play', 'player_play'])
            ->where('page_type', 'station')
            ->whereNotNull('reference_id')
            ->select('reference_id', DB::raw('count(*) as views'))
            ->groupBy('reference_id')
            ->pluck('views', 'reference_id')
            ->toArray();

        // Map numeric station IDs to slugs for frontend consumption
        $hitsBySlug = [];
        foreach ($hitsByStationId as $stationId => $views) {
            $station = Station::find($stationId);
            if ($station) {
                $hitsBySlug[$station->slug] = $views;
            }
        }

        return $hitsBySlug;
    }

    /**
     * Get total player plays for all stations
     * Counts both livestream_play and player_play events
     */
    public static function totalStationViews()
    {
        return AnalyticsEvent::whereIn('event_type', ['livestream_play', 'player_play'])
            ->where('page_type', 'station')
            ->count();
    }

    /**
     * Get station player plays by date range
     * Counts both livestream_play and player_play events
     * @param int|string $stationId Station ID (reference_id in analytics)
     */
    public static function stationViewsByDateRange($stationId, $startDate = null, $endDate = null)
    {
        $query = AnalyticsEvent::whereIn('event_type', ['livestream_play', 'player_play'])
            ->where('page_type', 'station')
            ->where('reference_id', $stationId);

        if ($startDate) {
            $query->where('created_at', '>=', $startDate);
        }

        if ($endDate) {
            $query->where('created_at', '<=', $endDate);
        }

        return $query->count();
    }

    /**
     * Get total livestream play clicks
     */
    public static function livestreamTotalPlays(): int
    {
        return AnalyticsEvent::where('event_type', 'livestream_play')->count();
    }

    /**
     * Get livestream plays today
     */
    public static function livestreamPlaysToday(): int
    {
        return AnalyticsEvent::where('event_type', 'livestream_play')
            ->whereDate('created_at', today())
            ->count();
    }

    /**
     * Get livestream plays this week
     */
    public static function livestreamPlaysThisWeek(): int
    {
        return AnalyticsEvent::where('event_type', 'livestream_play')
            ->where('created_at', '>=', now()->startOfWeek())
            ->count();
    }

    /**
     * Get livestream plays by day (last 30 days)
     * Returns [{date, views}] where "views" key matches DailyChart's expected shape
     */
    public static function livestreamDailyPlays($from = null, $to = null)
    {
        $query = AnalyticsEvent::where('event_type', 'livestream_play');
        self::applyDateRange($query, $from ?: now()->subDays(29)->startOfDay(), $to);
        return $query->select(DB::raw('DATE(created_at) as date'), DB::raw('count(*) as views'))
            ->groupBy(DB::raw('DATE(created_at)'))
            ->orderBy('date')
            ->get();
    }

    public static function livestreamPlaysThisMonth(): int
    {
        return AnalyticsEvent::where('event_type', 'livestream_play')
            ->where('created_at', '>=', now()->startOfMonth())
            ->count();
    }

    public static function playerPlaysTotal(): int
    {
        return AnalyticsEvent::where('event_type', 'player_play')->count();
    }

    public static function playerPlaysToday(): int
    {
        return AnalyticsEvent::where('event_type', 'player_play')
            ->whereDate('created_at', today())
            ->count();
    }

    public static function playerPlaysThisWeek(): int
    {
        return AnalyticsEvent::where('event_type', 'player_play')
            ->where('created_at', '>=', now()->startOfWeek())
            ->count();
    }

    public static function playerPlaysThisMonth(): int
    {
        return AnalyticsEvent::where('event_type', 'player_play')
            ->where('created_at', '>=', now()->startOfMonth())
            ->count();
    }

    public static function topStationsByPlayback(int $limit = 10, $from = null, $to = null)
    {
        $query = AnalyticsEvent::whereIn('event_type', ['player_play', 'livestream_play'])
            ->where('page_type', 'station')
            ->whereNotNull('reference_id');
        self::applyDateRange($query, $from, $to);
        return $query->select('reference_id', 'reference_title', DB::raw('count(*) as plays'))
            ->groupBy('reference_id', 'reference_title')
            ->orderByDesc('plays')
            ->limit($limit)
            ->get();
    }

    public static function playbackDaily($from = null, $to = null)
    {
        $query = AnalyticsEvent::whereIn('event_type', ['player_play', 'livestream_play']);
        self::applyDateRange($query, $from ?: now()->subDays(29)->startOfDay(), $to);
        return $query->select(
                DB::raw('DATE(created_at) as date'),
                DB::raw("SUM(CASE WHEN event_type = 'player_play' THEN 1 ELSE 0 END) as player_plays"),
                DB::raw("SUM(CASE WHEN event_type = 'livestream_play' THEN 1 ELSE 0 END) as livestream_plays")
            )
            ->groupBy(DB::raw('DATE(created_at)'))
            ->orderBy('date')
            ->get();
    }

    public static function uniqueVisitorsBreakdown(): array
    {
        return [
            'today'  => AnalyticsEvent::where('event_type', 'pageview')
                            ->whereDate('created_at', today())
                            ->distinct('session_id')->count('session_id'),
            'week'   => AnalyticsEvent::where('event_type', 'pageview')
                            ->where('created_at', '>=', now()->startOfWeek())
                            ->distinct('session_id')->count('session_id'),
            'month'  => AnalyticsEvent::where('event_type', 'pageview')
                            ->where('created_at', '>=', now()->startOfMonth())
                            ->distinct('session_id')->count('session_id'),
            'last30' => AnalyticsEvent::where('event_type', 'pageview')
                            ->where('created_at', '>=', now()->subDays(30))
                            ->distinct('session_id')->count('session_id'),
        ];
    }

    public static function dailyUniqueVisitors($from = null, $to = null)
    {
        $query = AnalyticsEvent::where('event_type', 'pageview');
        self::applyDateRange($query, $from ?: now()->subDays(29)->startOfDay(), $to);
        return $query->select(DB::raw('DATE(created_at) as date'), DB::raw('COUNT(DISTINCT session_id) as views'))
            ->groupBy(DB::raw('DATE(created_at)'))
            ->orderBy('date')
            ->get();
    }

    public static function uniqueVisitorsByDevice($from = null, $to = null)
    {
        $query = AnalyticsEvent::where('event_type', 'pageview');
        self::applyDateRange($query, $from, $to);
        return $query->select('device_type', DB::raw('COUNT(DISTINCT session_id) as count'))
            ->groupBy('device_type')
            ->orderByDesc('count')
            ->get();
    }

    public static function uniqueVisitorsInRange($from = null, $to = null): int
    {
        $query = AnalyticsEvent::where('event_type', 'pageview');
        self::applyDateRange($query, $from, $to);
        return $query->distinct('session_id')->count('session_id');
    }

    public static function pagesPerVisitor(int $days = 30): float
    {
        $since = now()->subDays($days);
        $views = AnalyticsEvent::where('event_type', 'pageview')
            ->where('created_at', '>=', $since)
            ->count();
        $visitors = AnalyticsEvent::where('event_type', 'pageview')
            ->where('created_at', '>=', $since)
            ->distinct('session_id')->count('session_id');

        if ($visitors === 0) return 0;
        return round($views / $visitors, 2);
    }
}
