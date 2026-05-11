<?php

namespace App\Http\Controllers\Backend;

use App\Services\AnalyticsService;
use App\Services\StationListenerService;
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

            // Range-scoped totals (drives the 5 stat cards at the top)
            'unique_visitors'        => AnalyticsService::uniqueVisitorsInRange($from, $to),

            // Range-scoped charts + top-N
            'top_articles'           => AnalyticsService::topArticles(10, $from, $to),
            'top_stations'           => AnalyticsService::topStations(10, $from, $to),
            'top_searches'           => AnalyticsService::topSearches(10, $from, $to),
            'top_directory_searches' => AnalyticsService::topDirectorySearches(10, $from, $to),
            'top_downloads'          => AnalyticsService::topDownloads(10, $from, $to),
            'daily_views'            => AnalyticsService::dailyViews($from, $to),
            'device_split'           => AnalyticsService::deviceSplit($from, $to),
            'livestream_daily'       => AnalyticsService::livestreamDailyPlays($from, $to),
            'top_stations_by_plays'  => AnalyticsService::topStationsByPlayback(10, $from, $to),

            // Live concurrent listeners (NOT range-scoped — always "right now")
            'listening_now'              => array_sum(StationListenerService::concurrentAllStations()),
            'top_stations_listening_now' => StationListenerService::topListeningNow(10, 5),

            'playback_daily'         => AnalyticsService::playbackDaily($from, $to),
            'visitors_daily'         => AnalyticsService::dailyUniqueVisitors($from, $to),
            'visitors_by_device'     => AnalyticsService::uniqueVisitorsByDevice($from, $to),
        ]);
    }
}
