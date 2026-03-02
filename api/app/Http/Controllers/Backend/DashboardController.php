<?php

namespace App\Http\Controllers\Backend;

use App\Models\Article;
use App\Models\User;
use App\Models\Banner;
use App\Models\Programme;
use App\Models\Video;
use App\Models\Asset;
use App\Models\Vod;
use App\Models\Directory;
use App\Services\AnalyticsService;

class DashboardController extends Controller
{
    public function index()
    {
        return response()->json([
            'counts' => [
                'articles'    => Article::count(),
                'users'       => User::count(),
                'banners'     => Banner::count(),
                'programmes'  => Programme::count(),
                'videos'      => Video::count(),
                'assets'      => Asset::count(),
                'vods'        => Vod::count(),
                'directories' => Directory::count(),
            ],
            'analytics' => AnalyticsService::summary(),
        ]);
    }
}
