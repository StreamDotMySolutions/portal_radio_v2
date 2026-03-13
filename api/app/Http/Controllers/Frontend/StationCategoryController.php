<?php

namespace App\Http\Controllers\Frontend;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\StationCategory;

class StationCategoryController extends Controller
{
    public function index()
    {
        $categories = StationCategory::where('active', true)
            ->orderBy('sort_order')
            ->get(['display_name', 'slug']);

        return response()->json(['categories' => $categories]);
    }
}
