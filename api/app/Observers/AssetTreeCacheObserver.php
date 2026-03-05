<?php

namespace App\Observers;

use Illuminate\Support\Facades\Cache;

class AssetTreeCacheObserver
{
    public function saved($model): void
    {
        Cache::forget('backend.asset.tree');
    }

    public function deleted($model): void
    {
        Cache::forget('backend.asset.tree');
    }
}
