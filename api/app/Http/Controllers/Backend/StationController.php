<?php

namespace App\Http\Controllers\Backend;

use Illuminate\Http\Request;
use App\Models\Station;
use App\Services\CommonService;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class StationController extends Controller
{
    public function index(Request $request)
    {
        $query = Station::defaultOrder()
            ->leftJoin('analytics_events', function ($join) {
                $join->on('stations.slug', '=', 'analytics_events.reference_id')
                     ->where('analytics_events.event_type', '=', 'pageview')
                     ->where('analytics_events.page_type', '=', 'station');
            })
            ->select('stations.*', DB::raw('COUNT(analytics_events.id) as pageview_hits'))
            ->groupBy('stations.id');

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where('stations.title', 'like', "%{$search}%");
        }

        if ($request->filled('category')) {
            $query->where('stations.category', $request->input('category'));
        }

        if ($request->has('active') && $request->input('active') !== '') {
            $query->where('stations.active', $request->input('active'));
        }

        $stations = $query->paginate(10)->withQueryString();

        return response()->json(['stations' => $stations]);
    }

    public function show(Station $station)
    {
        return response()->json(['station' => $station]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string',
            'description' => 'sometimes|string',
            'frequency' => 'sometimes|string',
            'category' => 'required|in:nasional,negeri',
            'slug' => 'sometimes|string|unique:stations',
            'rtmklik_player_url' => 'sometimes|string',
            'facebook_url' => 'sometimes|string',
            'x_url' => 'sometimes|string',
            'instagram_url' => 'sometimes|string',
            'youtube_url' => 'sometimes|string',
            'tiktok_url' => 'sometimes|string',
            'thumbnail' => 'sometimes|image|mimes:jpeg,png,jpg,gif|max:2048',
            'banner' => 'sometimes|image|mimes:jpeg,png,jpg,gif|max:2048',
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
            'category' => $request->input('category'),
            'rtmklik_player_url' => $request->input('rtmklik_player_url'),
            'facebook_url' => $request->input('facebook_url'),
            'x_url' => $request->input('x_url'),
            'instagram_url' => $request->input('instagram_url'),
            'youtube_url' => $request->input('youtube_url'),
            'tiktok_url' => $request->input('tiktok_url'),
            'thumbnail_filename' => $request->hasFile('thumbnail')
                ? CommonService::handleStoreFile($request->file('thumbnail'), 'station-thumbnails') : null,
            'banner_filename' => $request->hasFile('banner')
                ? CommonService::handleStoreFile($request->file('banner'), 'station-banners') : null,
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
            'category' => 'sometimes|in:nasional,negeri',
            'slug' => 'sometimes|string|unique:stations,slug,' . $station->id,
            'rtmklik_player_url' => 'sometimes|string',
            'facebook_url' => 'sometimes|string',
            'x_url' => 'sometimes|string',
            'instagram_url' => 'sometimes|string',
            'youtube_url' => 'sometimes|string',
            'tiktok_url' => 'sometimes|string',
            'thumbnail' => 'sometimes|image|mimes:jpeg,png,jpg,gif|max:2048',
            'banner' => 'sometimes|image|mimes:jpeg,png,jpg,gif|max:2048',
            'accent_color' => 'sometimes|string|max:20',
            'active' => 'sometimes|boolean',
        ]);

        $data = $request->only([
            'title', 'slug', 'description', 'frequency', 'category',
            'rtmklik_player_url', 'facebook_url', 'x_url',
            'instagram_url', 'youtube_url', 'tiktok_url', 'accent_color', 'active'
        ]);

        if ($request->hasFile('thumbnail')) {
            if ($station->thumbnail_filename) {
                CommonService::handleDeleteFile($station->thumbnail_filename, 'station-thumbnails');
            }
            $data['thumbnail_filename'] = CommonService::handleStoreFile($request->file('thumbnail'), 'station-thumbnails');
        }

        if ($request->hasFile('banner')) {
            if ($station->banner_filename) {
                CommonService::handleDeleteFile($station->banner_filename, 'station-banners');
            }
            $data['banner_filename'] = CommonService::handleStoreFile($request->file('banner'), 'station-banners');
        }

        $station->update($data);

        return response()->json(['message' => 'Station successfully updated']);
    }

    public function delete(Station $station)
    {
        if ($station->thumbnail_filename) {
            CommonService::handleDeleteFile($station->thumbnail_filename, 'station-thumbnails');
        }
        if ($station->banner_filename) {
            CommonService::handleDeleteFile($station->banner_filename, 'station-banners');
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
