<?php

namespace App\Http\Controllers\Backend;

use Illuminate\Http\Request;
use App\Models\StationCategory;
use Illuminate\Support\Str;

class StationCategoryController extends Controller
{
    public function index(Request $request)
    {
        $query = StationCategory::query();

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where('display_name', 'like', "%{$search}%")
                  ->orWhere('slug', 'like', "%{$search}%");
        }

        if ($request->has('active') && $request->input('active') !== '') {
            $query->where('active', $request->input('active'));
        }

        $sortBy = $request->input('sort_by', null);
        $sortDir = $request->input('sort_dir', 'asc');

        if ($sortBy === 'display_name') {
            $query->orderBy('display_name', $sortDir);
        } else {
            $query->defaultOrder();
        }

        $perPage = $request->input('per_page', 15);
        $categories = $query->paginate($perPage)->withQueryString();

        return response()->json(['categories' => $categories]);
    }

    public function show(StationCategory $stationCategory)
    {
        return response()->json(['category' => $stationCategory]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'display_name' => 'required|string',
            'slug' => 'required|string|unique:station_categories',
            'active' => 'required|boolean',
        ]);

        $category = StationCategory::create([
            'display_name' => $request->input('display_name'),
            'slug' => $request->input('slug'),
            'active' => $request->input('active'),
        ]);

        if (!$category) {
            return response()->json(['message' => 'Category creation failed'], 500);
        }

        return response()->json(['message' => 'Category creation success']);
    }

    public function update(Request $request, StationCategory $stationCategory)
    {
        $request->validate([
            'display_name' => 'sometimes|string',
            'slug' => 'sometimes|string|unique:station_categories,slug,' . $stationCategory->id,
            'active' => 'sometimes|boolean',
        ]);

        $data = $request->only(['display_name', 'slug', 'active']);
        $stationCategory->update($data);

        return response()->json(['message' => 'Category successfully updated']);
    }

    public function delete(StationCategory $stationCategory)
    {
        if ($stationCategory->delete()) {
            return response()->json(['message' => 'Category successfully deleted']);
        } else {
            return response()->json(['message' => 'Category delete failed'], 500);
        }
    }

    public function toggle(StationCategory $stationCategory)
    {
        $stationCategory->update(['active' => $stationCategory->active == 1 ? 0 : 1]);
        return response()->json(['message' => 'Category updated successfully']);
    }

    public function ordering(StationCategory $stationCategory, Request $request)
    {
        switch ($request->input('direction')) {
            case 'up':
                $stationCategory->up();
                return response()->json(['message' => 'Category moved up']);
                break;
            case 'down':
                $stationCategory->down();
                return response()->json(['message' => 'Category moved down']);
                break;
        }
    }
}
