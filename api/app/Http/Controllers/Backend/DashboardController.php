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
use App\Models\Station;
use App\Models\StationCategory;
use App\Models\ChatUser;
use App\Models\ChatMessage;
use App\Services\AnalyticsService;
use Spatie\Activitylog\Models\Activity;

class DashboardController extends Controller
{
    public function index()
    {
        $foldersCount = Article::where('type', 'folder')->count();
        $pagesCount = Article::where('type', '!=', 'folder')->count();

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

        $bannersActive = Banner::where('active', 1)->count();
        $bannersInactive = Banner::where('active', 0)->count();

        $assetsFilesize = Asset::sum('filesize') ?? 0;
        $vodsFilesize = Vod::sum('filesize') ?? 0;

        $users = User::select('id', 'name', 'email')
            ->get()
            ->map(function($user) {
                $activitiesCount = Activity::where('causer_id', $user->id)
                    ->where('causer_type', User::class)
                    ->count();
                $lastActivity = Activity::where('causer_id', $user->id)
                    ->where('causer_type', User::class)
                    ->latest('created_at')
                    ->first();
                return [
                    'id'    => $user->id,
                    'name'  => $user->name,
                    'email' => $user->email,
                    'activities_count' => $activitiesCount,
                    'last_login_at' => $lastActivity?->created_at,
                ];
            });

        $stationCategories = StationCategory::query()
            ->withCount(['stations', 'stations as active_stations_count' => function ($q) {
                $q->where('active', true);
            }])
            ->get()
            ->map(function ($cat) {
                $pageviews = \App\Models\AnalyticsEvent::where('event_type', 'pageview')
                    ->where('page_type', 'station')
                    ->whereIn('reference_id', $cat->stations()->pluck('stations.id'))
                    ->count();
                return [
                    'display_name' => $cat->display_name,
                    'slug' => $cat->slug,
                    'stations_count' => $cat->stations_count,
                    'active_stations_count' => $cat->active_stations_count,
                    'pageviews' => $pageviews,
                ];
            });

        return response()->json([
            'counts' => [
                'articles'    => Article::count(),
                'articles_breakdown' => [
                    'folders' => $foldersCount,
                    'pages'   => $pagesCount,
                ],
                'users'       => User::count(),
                'users_list'  => $users,
                'banners'     => Banner::count(),
                'banners_breakdown' => [
                    'active'   => $bannersActive,
                    'inactive' => $bannersInactive,
                ],
                'programmes'  => Programme::count(),
                'videos'      => Video::count(),
                'stations'          => Station::where('active', true)->count(),
                'stations_pageviews' => \App\Models\AnalyticsEvent::where('event_type', 'pageview')->where('page_type', 'station')->count(),
                'livestream_plays'  => AnalyticsService::livestreamTotalPlays(),
                'chat_users'        => ChatUser::count(),
                'chat_messages'     => ChatMessage::count(),
                'assets'      => Asset::count(),
                'assets_filesize' => $assetsFilesize,
                'vods'        => Vod::count(),
                'vods_filesize' => $vodsFilesize,
                'directories' => Directory::count(),
                'directories_breakdown' => [
                    'departments' => $departmentsCount,
                    'staffs'      => $staffsCount,
                    'empty_staffs' => $emptyStaffsCount,
                ],
            ],
            'analytics' => AnalyticsService::summary(),
            'station_categories' => $stationCategories,
        ]);
    }
}
