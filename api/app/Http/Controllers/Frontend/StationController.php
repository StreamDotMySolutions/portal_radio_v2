<?php

namespace App\Http\Controllers\Frontend;

use Illuminate\Http\Request;
use App\Models\Station;
use App\Models\StationCategory;

class StationController extends Controller
{
    public function index(Request $request)
    {
        $query = Station::query()->where('active', 1);

        if ($request->filled('category')) {
            $query->where('category', $request->input('category'));
        }

        if ($request->filled('q')) {
            $search = $request->input('q');
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhere('frequency', 'like', "%{$search}%")
                  ->orWhere('category', 'like', "%{$search}%");
            });
        }

        $stations = $query->defaultOrder()->get();

        // Map category slug to display_name
        $categories = StationCategory::all()->keyBy('slug');
        $stations = $stations->map(function ($station) use ($categories) {
            $station->category_display = $categories[$station->category]->display_name ?? $station->category;
            return $station;
        });

        return response()->json(['stations' => $stations]);
    }

    public function show(Station $station)
    {
        if (!$station->active) abort(404);
        return response()->json(['station' => $station]);
    }
}
