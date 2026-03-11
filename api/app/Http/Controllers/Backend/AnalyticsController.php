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
        ]);
    }
}
