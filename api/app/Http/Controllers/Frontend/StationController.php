<?php

namespace App\Http\Controllers\Frontend;

use Illuminate\Http\Request;
use App\Models\Station;
use App\Models\StationCategory;

class StationController extends Controller
{
    public function index(Request $request)
    {
        $query = Station::query()->where('active', 1)->with('category');

        if ($request->filled('category')) {
            $query->whereHas('category', function ($q) {
                $q->where('slug', request()->input('category'));
            });
        }

        if ($request->filled('q')) {
            $search = $request->input('q');
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhere('frequency', 'like', "%{$search}%");
            });
        }

        $stations = $query->defaultOrder()->get();

        // Add category slug and display_name to response for frontend
        $stations = $stations->map(function ($station) {
            $cat = $station->getRelation('category');
            $station->category = $cat ? $cat->slug : null;
            $station->category_display = $cat ? $cat->display_name : '';
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
