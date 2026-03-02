<?php

namespace App\Http\Controllers\Backend;

use App\Services\AnalyticsService;

class AnalyticsController extends Controller
{
    public function index()
    {
        return response()->json([
            'summary'      => AnalyticsService::summary(),
            'top_articles' => AnalyticsService::topArticles(),
            'top_searches' => AnalyticsService::topSearches(),
            'daily_views'  => AnalyticsService::dailyViews(),
            'device_split' => AnalyticsService::deviceSplit(),
        ]);
    }
}
