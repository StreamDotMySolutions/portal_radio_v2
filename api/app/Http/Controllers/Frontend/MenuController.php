<?php

namespace App\Http\Controllers\Frontend;

use Illuminate\Http\Request;
use App\Services\ArticleService;
use App\Models\Article;
use App\Models\ArticleData;


class MenuController extends Controller
{
    public function index()
    {

        // make sure create a content title = footer
        $parent = Article::where('title', 'MENU')->first();
        $items = Article::query()->select('id')->where('parent_id', $parent->id)->defaultOrder()->get();
        
        return response()->json([
            'items' => $items
        ]);

    }

}
