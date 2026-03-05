<?php

namespace App\Observers;

use Illuminate\Support\Facades\Cache;

class DirectoryTreeCacheObserver
{
    public function saved($model): void
    {
        Cache::forget('backend.directory.tree');
    }

    public function deleted($model): void
    {
        Cache::forget('backend.directory.tree');
    }
}
