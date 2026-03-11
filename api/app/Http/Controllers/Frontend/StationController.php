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

        $stations = $query->orderBy('title')->get();

        return response()->json(['stations' => $stations]);
    }
}
