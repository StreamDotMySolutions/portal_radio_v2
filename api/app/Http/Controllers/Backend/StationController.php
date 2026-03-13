<?php

namespace App\Http\Controllers\Backend;

use Illuminate\Http\Request;
use App\Models\Station;
use App\Models\StationCategory;
use App\Services\CommonService;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class StationController extends Controller
{
    public function index(Request $request)
    {
        $query = Station::query()
            ->leftJoin('station_categories', 'stations.station_category_id', '=', 'station_categories.id')
            ->leftJoin('analytics_events', function ($join) {
                $join->on('stations.id', '=', 'analytics_events.reference_id')
                     ->where('analytics_events.event_type', '=', 'pageview')
                     ->where('analytics_events.page_type', '=', 'station');
            })
            ->select('stations.*', 'station_categories.slug as category', DB::raw('COUNT(analytics_events.id) as pageview_hits'))
            ->groupBy('stations.id');

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where('stations.title', 'like', "%{$search}%");
        }

        if ($request->filled('category')) {
            $query->where('station_categories.slug', $request->input('category'));
        }

        if ($request->has('active') && $request->input('active') !== '') {
            $query->where('stations.active', $request->input('active'));
        }

        // Handle sorting
        $sortBy = $request->input('sort_by', null);
        $sortDir = $request->input('sort_dir', 'desc');

        if ($sortBy === 'created_at') {
            $query->orderBy('stations.created_at', $sortDir);
        } else {
            $query->defaultOrder();
        }

        $perPage = $request->input('per_page', 15);
        $stations = $query->paginate($perPage)->withQueryString();

        return response()->json(['stations' => $stations]);
    }

    public function show(Station $station)
    {
        // Get category slug via join instead of relationship
        $stationWithCategory = Station::query()
            ->leftJoin('station_categories', 'stations.station_category_id', '=', 'station_categories.id')
            ->select('stations.*', 'station_categories.slug as category')
            ->where('stations.id', $station->id)
            ->first();

        return response()->json(['station' => $stationWithCategory]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string',
            'description' => 'sometimes|string',
            'frequency' => 'sometimes|string',
            'station_category_id' => 'required|exists:station_categories,id',
            'slug' => 'sometimes|string|unique:stations',
            'rtmklik_player_url' => 'sometimes|string',
            'facebook_url' => 'sometimes|string',
            'x_url' => 'sometimes|string',
            'instagram_url' => 'sometimes|string',
            'youtube_url' => 'sometimes|string',
            'tiktok_url' => 'sometimes|string',
            'thumbnail' => 'sometimes|image|mimes:jpeg,png,jpg,gif|max:102400',
            'banner' => 'sometimes|image|mimes:jpeg,png,jpg,gif|max:102400',
            'accent_color' => 'sometimes|string|max:20',
            'active' => 'required|boolean',
        ]);

        $slug = $request->input('slug') ?: Str::slug($request->input('title'));

        $station = Station::create([
            'user_id' => auth('sanctum')->user()->id,
            'title' => $request->input('title'),
            'slug' => $slug,
            'description' => $request->input('description'),
            'frequency' => $request->input('frequency'),
            'station_category_id' => $request->input('station_category_id'),
            'rtmklik_player_url' => $request->input('rtmklik_player_url'),
            'facebook_url' => $request->input('facebook_url'),
            'x_url' => $request->input('x_url'),
            'instagram_url' => $request->input('instagram_url'),
            'youtube_url' => $request->input('youtube_url'),
            'tiktok_url' => $request->input('tiktok_url'),
            'thumbnail_filename' => $request->hasFile('thumbnail')
                ? CommonService::handleStoreFile($request->file('thumbnail'), 'stations') : null,
            'banner_filename' => $request->hasFile('banner')
                ? CommonService::handleStoreFile($request->file('banner'), 'stations') : null,
            'accent_color' => $request->input('accent_color'),
            'active' => $request->input('active'),
        ]);

        if (!$station) {
            return response()->json(['message' => 'Station creation failed'], 500);
        }

        return response()->json(['message' => 'Station creation success']);
    }

    public function update(Request $request, Station $station)
    {
        $request->validate([
            'title' => 'sometimes|string',
            'description' => 'sometimes|string',
            'frequency' => 'sometimes|string',
            'station_category_id' => 'sometimes|exists:station_categories,id',
            'slug' => 'sometimes|string|unique:stations,slug,' . $station->id,
            'rtmklik_player_url' => 'sometimes|string',
            'facebook_url' => 'sometimes|string',
            'x_url' => 'sometimes|string',
            'instagram_url' => 'sometimes|string',
            'youtube_url' => 'sometimes|string',
            'tiktok_url' => 'sometimes|string',
            'thumbnail' => 'sometimes|image|mimes:jpeg,png,jpg,gif|max:102400',
            'banner' => 'sometimes|image|mimes:jpeg,png,jpg,gif|max:102400',
            'accent_color' => 'sometimes|string|max:20',
            'active' => 'sometimes|boolean',
        ]);

        $data = $request->only([
            'title', 'slug', 'description', 'frequency', 'station_category_id',
            'rtmklik_player_url', 'facebook_url', 'x_url',
            'instagram_url', 'youtube_url', 'tiktok_url', 'accent_color', 'active'
        ]);

        if ($request->hasFile('thumbnail')) {
            if ($station->thumbnail_filename) {
                CommonService::handleDeleteFile($station->thumbnail_filename, 'stations');
            }
            $data['thumbnail_filename'] = CommonService::handleStoreFile($request->file('thumbnail'), 'stations');
        }

        if ($request->hasFile('banner')) {
            if ($station->banner_filename) {
                CommonService::handleDeleteFile($station->banner_filename, 'stations');
            }
            $data['banner_filename'] = CommonService::handleStoreFile($request->file('banner'), 'stations');
        }

        $station->update($data);

        return response()->json(['message' => 'Station successfully updated']);
    }

    public function delete(Station $station)
    {
        if ($station->thumbnail_filename) {
            CommonService::handleDeleteFile($station->thumbnail_filename, 'stations');
        }
        if ($station->banner_filename) {
            CommonService::handleDeleteFile($station->banner_filename, 'stations');
        }

        if ($station->delete()) {
            return response()->json(['message' => 'Station successfully deleted']);
        } else {
            return response()->json(['message' => 'Station delete failed'], 500);
        }
    }

    public function toggle(Station $station)
    {
        $station->update(['active' => $station->active == 1 ? 0 : 1]);
        return response()->json(['message' => 'Station updated successfully']);
    }

    public function ordering(Station $station, Request $request)
    {
        switch ($request->input('direction')) {
            case 'up':
                $station->up();
                return response()->json(['message' => 'Station moved up']);
                break;
            case 'down':
                $station->down();
                return response()->json(['message' => 'Station moved down']);
                break;
        }
    }
}
