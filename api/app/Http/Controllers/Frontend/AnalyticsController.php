<?php

namespace App\Http\Controllers\Frontend;

use App\Models\AnalyticsEvent;
use App\Services\AnalyticsService;
use App\Services\StationListenerService;
use Illuminate\Http\Request;

class AnalyticsController extends Controller
{
    public function stationHits()
    {
        return response()->json(AnalyticsService::allStationViews());
    }

    public function livestreamHits()
    {
        return response()->json(['plays' => AnalyticsService::livestreamTotalPlays()]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'session_id'      => 'required|string|max:36',
            'event_type'      => 'required|string|max:50',
            'page_type'       => 'nullable|string|max:50',
            'reference_id'    => 'nullable|integer',
            'reference_title' => 'nullable|string|max:255',
            'device_type'     => 'nullable|string|max:20',
            'referrer'        => 'nullable|string|max:500',
        ]);

        AnalyticsEvent::create($data);

        return response()->json(['message' => 'ok']);
    }

    public function heartbeat(Request $request)
    {
        $data = $request->validate([
            'session_id' => 'required|string|max:64',
            'station_id' => 'required|integer|exists:stations,id',
        ]);

        StationListenerService::heartbeat($data['session_id'], (int) $data['station_id']);

        return response()->json(['message' => 'ok']);
    }

    public function listenerCounts()
    {
        $counts = StationListenerService::concurrentBySlug();

        return response()->json([
            'counts' => $counts,
            'total'  => array_sum($counts),
        ]);
    }
}
