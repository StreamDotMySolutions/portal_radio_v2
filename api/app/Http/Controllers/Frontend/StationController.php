<?php

namespace App\Http\Controllers\Frontend;

use Illuminate\Http\Request;
use App\Models\Station;

class StationController extends Controller
{
    public function index(Request $request)
    {
        $query = Station::query()->where('active', 1);

        if ($request->filled('category')) {
            $query->where('category', $request->input('category'));
        }

        $stations = $query->defaultOrder()->get();

        return response()->json(['stations' => $stations]);
    }

    public function show(Station $station)
    {
        if (!$station->active) abort(404);
        return response()->json(['station' => $station]);
    }
}
