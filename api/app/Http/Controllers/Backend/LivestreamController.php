<?php

namespace App\Http\Controllers\Backend;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use App\Services\AnalyticsService;
use Illuminate\Http\JsonResponse;

class LivestreamController extends Controller
{
    /**
     * Get livestream settings and analytics
     */
    public function index(): JsonResponse
    {
        return response()->json([
            'stream_url' => Setting::get('livestream_url'),
            'stats' => [
                'total'       => AnalyticsService::livestreamTotalPlays(),
                'today'       => AnalyticsService::livestreamPlaysToday(),
                'this_week'   => AnalyticsService::livestreamPlaysThisWeek(),
                'daily_plays' => AnalyticsService::livestreamDailyPlays(),
            ],
        ]);
    }
}
