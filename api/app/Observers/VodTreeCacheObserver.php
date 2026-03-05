<?php

namespace App\Observers;

use Illuminate\Support\Facades\Cache;

class VodTreeCacheObserver
{
    public function saved($model): void
    {
        Cache::forget('backend.vod.tree');
    }

    public function deleted($model): void
    {
        Cache::forget('backend.vod.tree');
    }
}
