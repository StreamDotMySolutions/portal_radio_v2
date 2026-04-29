<?php

namespace App\Http\Controllers\Backend;

use App\Services\AnalyticsService;

class AnalyticsController extends Controller
{
    public function index()
    {
        return response()->json([
            'summary'                => AnalyticsService::summary(),
            'top_articles'           => AnalyticsService::topArticles(),
            'top_stations'           => AnalyticsService::topStations(),
            'top_searches'           => AnalyticsService::topSearches(),
            'top_directory_searches' => AnalyticsService::topDirectorySearches(),
            'top_downloads'          => AnalyticsService::topDownloads(),
            'daily_views'            => AnalyticsService::dailyViews(),
            'device_split'           => AnalyticsService::deviceSplit(),
            'livestream_summary'     => [
                'total'     => AnalyticsService::livestreamTotalPlays(),
                'today'     => AnalyticsService::livestreamPlaysToday(),
                'this_week' => AnalyticsService::livestreamPlaysThisWeek(),
            ],
            'livestream_daily'       => AnalyticsService::livestreamDailyPlays(),
            'playback_summary'       => [
                'player_today'      => AnalyticsService::playerPlaysToday(),
                'player_week'       => AnalyticsService::playerPlaysThisWeek(),
                'player_month'      => AnalyticsService::playerPlaysThisMonth(),
                'player_total'      => AnalyticsService::playerPlaysTotal(),
                'livestream_today'  => AnalyticsService::livestreamPlaysToday(),
                'livestream_week'   => AnalyticsService::livestreamPlaysThisWeek(),
                'livestream_month'  => AnalyticsService::livestreamPlaysThisMonth(),
                'livestream_total'  => AnalyticsService::livestreamTotalPlays(),
            ],
            'top_stations_by_plays'  => AnalyticsService::topStationsByPlayback(),
            'playback_daily'         => AnalyticsService::playbackDaily(),
            'visitors_breakdown'     => AnalyticsService::uniqueVisitorsBreakdown(),
            'visitors_daily'         => AnalyticsService::dailyUniqueVisitors(),
            'visitors_by_device'     => AnalyticsService::uniqueVisitorsByDevice(),
            'pages_per_visitor'      => AnalyticsService::pagesPerVisitor(30),
        ]);
    }
}
