<?php

namespace App\Http\Controllers\Frontend;

use App\Models\AnalyticsEvent;
use App\Services\AnalyticsService;
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
}
