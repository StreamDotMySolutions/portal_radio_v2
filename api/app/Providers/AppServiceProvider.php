<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Auth\Notifications\ResetPassword;
use App\Models\Article;
use App\Models\ArticleSetting;
use App\Observers\MenuCacheObserver;

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

        // check ReactJS Router
        ResetPassword::createUrlUsing(function ($user, string $token) {
            $url = env("FRONTEND_URL");
            return $url . '/password/reset/' . $token;
        });
    }
}
