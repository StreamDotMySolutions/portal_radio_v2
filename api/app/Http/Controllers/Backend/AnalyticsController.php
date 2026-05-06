<?php

namespace App\Http\Controllers\Backend;

use App\Services\AnalyticsService;
use Illuminate\Http\Request;
use Carbon\Carbon;

class AnalyticsController extends Controller
{
    public function index(Request $request)
    {
        $from = $request->filled('from')
            ? Carbon::parse($request->input('from'))->startOfDay()
            : now()->subDays(29)->startOfDay();

        $to = $request->filled('to')
            ? Carbon::parse($request->input('to'))->endOfDay()
            : now()->endOfDay();

        return response()->json([
            'range' => [
                'from' => $from->toDateString(),
                'to'   => $to->toDateString(),
            ],
            'summary'                => AnalyticsService::summary(),
            'top_articles'           => AnalyticsService::topArticles(10, $from, $to),
            'top_stations'           => AnalyticsService::topStations(10, $from, $to),
            'top_searches'           => AnalyticsService::topSearches(10, $from, $to),
            'top_directory_searches' => AnalyticsService::topDirectorySearches(10, $from, $to),
            'top_downloads'          => AnalyticsService::topDownloads(10, $from, $to),
            'daily_views'            => AnalyticsService::dailyViews($from, $to),
            'device_split'           => AnalyticsService::deviceSplit($from, $to),
            'livestream_summary'     => [
                'total'     => AnalyticsService::livestreamTotalPlays(),
                'today'     => AnalyticsService::livestreamPlaysToday(),
                'this_week' => AnalyticsService::livestreamPlaysThisWeek(),
            ],
            'livestream_daily'       => AnalyticsService::livestreamDailyPlays($from, $to),
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
            'top_stations_by_plays'  => AnalyticsService::topStationsByPlayback(10, $from, $to),
            'playback_daily'         => AnalyticsService::playbackDaily($from, $to),
            'visitors_breakdown'     => AnalyticsService::uniqueVisitorsBreakdown(),
            'visitors_daily'         => AnalyticsService::dailyUniqueVisitors($from, $to),
            'visitors_by_device'     => AnalyticsService::uniqueVisitorsByDevice($from, $to),
            'pages_per_visitor'      => AnalyticsService::pagesPerVisitor(30),
        ]);
    }
}
