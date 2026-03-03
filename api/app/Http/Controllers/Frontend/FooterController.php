<?php

namespace App\Http\Controllers\Frontend;

use Illuminate\Http\Request;
use App\Services\ArticleService;
use App\Models\Article;
use App\Models\ArticleData;
use Illuminate\Support\Facades\Cache;


class FooterController extends Controller
{
    public function index()
    {
        $data = Cache::remember('frontend.menu.footer', 86400, function () {
            // make sure create a content title = menu
            $parent = Article::where('title', 'FOOTER')->first();

            return ['id' => $parent->id];
        });

        return response()->json($data);
    }

}
