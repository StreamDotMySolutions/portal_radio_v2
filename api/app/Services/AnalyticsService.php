<?php

namespace App\Services;

use App\Models\AnalyticsEvent;
use Illuminate\Support\Facades\DB;

class AnalyticsService
{
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

    public static function topArticles(int $limit = 10)
    {
        return AnalyticsEvent::where('event_type', 'pageview')
            ->whereNotNull('reference_title')
            ->select('reference_id', 'reference_title', 'page_type', DB::raw('count(*) as views'))
            ->groupBy('reference_id', 'reference_title', 'page_type')
            ->orderByDesc('views')
            ->limit($limit)
            ->get();
    }

    public static function topStations(int $limit = 10)
    {
        return AnalyticsEvent::where('event_type', 'pageview')
            ->where('page_type', 'station')
            ->whereNotNull('reference_id')
            ->select('reference_id', 'reference_title', DB::raw('count(*) as views'))
            ->groupBy('reference_id', 'reference_title')
            ->orderByDesc('views')
            ->limit($limit)
            ->get();
    }

    public static function topSearches(int $limit = 10)
    {
        return AnalyticsEvent::where('event_type', 'search')
            ->whereNotNull('reference_title')
            ->select('reference_title as query', DB::raw('count(*) as count'))
            ->groupBy('reference_title')
            ->orderByDesc('count')
            ->limit($limit)
            ->get();
    }

    public static function topDirectorySearches(int $limit = 10)
    {
        return AnalyticsEvent::where('event_type', 'search')
            ->where('page_type', 'directory')
            ->whereNotNull('reference_title')
            ->select('reference_title as query', DB::raw('count(*) as count'))
            ->groupBy('reference_title')
            ->orderByDesc('count')
            ->limit($limit)
            ->get();
    }

    public static function dailyViews()
    {
        return AnalyticsEvent::where('event_type', 'pageview')
            ->where('created_at', '>=', now()->subDays(29)->startOfDay())
            ->select(DB::raw('DATE(created_at) as date'), DB::raw('count(*) as views'))
            ->groupBy(DB::raw('DATE(created_at)'))
            ->orderBy('date')
            ->get();
    }

    public static function topDownloads(int $limit = 10)
    {
        return AnalyticsEvent::where('event_type', 'download')
            ->whereNotNull('reference_title')
            ->select('reference_title as filename', 'page_type', DB::raw('count(*) as count'))
            ->groupBy('reference_title', 'page_type')
            ->orderByDesc('count')
            ->limit($limit)
            ->get();
    }

    public static function deviceSplit()
    {
        return AnalyticsEvent::where('event_type', 'pageview')
            ->select('device_type', DB::raw('count(*) as count'))
            ->groupBy('device_type')
            ->orderByDesc('count')
            ->get();
    }

    /**
     * Get pageview count for a specific station
     */
    public static function stationViews(string $stationSlug)
    {
        return AnalyticsEvent::where('event_type', 'pageview')
            ->where('page_type', 'station')
            ->where('reference_id', $stationSlug)
            ->count();
    }

    /**
     * Get total pageviews for all stations
     */
    public static function totalStationViews()
    {
        return AnalyticsEvent::where('event_type', 'pageview')
            ->where('page_type', 'station')
            ->count();
    }

    /**
     * Get station pageviews by date range
     */
    public static function stationViewsByDateRange(string $stationSlug, $startDate = null, $endDate = null)
    {
        $query = AnalyticsEvent::where('event_type', 'pageview')
            ->where('page_type', 'station')
            ->where('reference_id', $stationSlug);

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
    public static function livestreamDailyPlays()
    {
        return AnalyticsEvent::where('event_type', 'livestream_play')
            ->where('created_at', '>=', now()->subDays(29)->startOfDay())
            ->select(DB::raw('DATE(created_at) as date'), DB::raw('count(*) as views'))
            ->groupBy(DB::raw('DATE(created_at)'))
            ->orderBy('date')
            ->get();
    }
}
