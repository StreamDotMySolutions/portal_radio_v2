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
            ->whereIn('page_type', ['article', 'listing'])
            ->whereNotNull('reference_id')
            ->select('reference_id', 'reference_title', 'page_type', DB::raw('count(*) as views'))
            ->groupBy('reference_id', 'reference_title', 'page_type')
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

    public static function deviceSplit()
    {
        return AnalyticsEvent::where('event_type', 'pageview')
            ->select('device_type', DB::raw('count(*) as count'))
            ->groupBy('device_type')
            ->orderByDesc('count')
            ->get();
    }
}
