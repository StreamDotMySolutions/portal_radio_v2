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
        $departmentsCount = Directory::where('type', 'folder')->count();
        $staffsCount = Directory::where('type', '!=', 'folder')->count();
        $emptyStaffsCount = Directory::where('type', '!=', 'folder')
            ->where(function($q) {
                $q->whereNull('name')
                  ->orWhere('name', '')
                  ->orWhere(function($subQ) {
                      $subQ->whereNull('photo')
                           ->orWhere('photo', '');
                  });
            })
            ->count();

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
                'directories_breakdown' => [
                    'departments' => $departmentsCount,
                    'staffs'      => $staffsCount,
                    'empty_staffs' => $emptyStaffsCount,
                ],
            ],
            'analytics' => AnalyticsService::summary(),
        ]);
    }
}
