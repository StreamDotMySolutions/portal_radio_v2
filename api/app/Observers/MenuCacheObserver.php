<?php

namespace App\Observers;

use Illuminate\Support\Facades\Cache;

class MenuCacheObserver
{
    private static array $keys = [
        'frontend.menu.index',
        'frontend.menu.menu1',
        'frontend.menu.menu2',
        'frontend.menu.sitemap',
        'frontend.menu.footer',
    ];

    public function saved($model): void
    {
        $this->clearMenuCache();
    }

    public function deleted($model): void
    {
        $this->clearMenuCache();
    }

    private function clearMenuCache(): void
    {
        foreach (self::$keys as $key) {
            Cache::forget($key);
        }
    }
}
