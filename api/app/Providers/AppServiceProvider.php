<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Auth\Notifications\ResetPassword;
use App\Models\Article;
use App\Models\ArticleSetting;
use App\Models\Directory;
use App\Models\Asset;
use App\Models\Vod;
use App\Observers\MenuCacheObserver;
use App\Observers\DirectoryTreeCacheObserver;
use App\Observers\AssetTreeCacheObserver;
use App\Observers\VodTreeCacheObserver;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Article::observe(MenuCacheObserver::class);
        ArticleSetting::observe(MenuCacheObserver::class);

        Directory::observe(DirectoryTreeCacheObserver::class);
        Asset::observe(AssetTreeCacheObserver::class);
        Vod::observe(VodTreeCacheObserver::class);

        // check ReactJS Router
        ResetPassword::createUrlUsing(function ($user, string $token) {
            $url = env("FRONTEND_URL");
            return $url . '/password/reset/' . $token;
        });
    }
}
