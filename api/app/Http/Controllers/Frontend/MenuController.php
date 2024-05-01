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

        // make sure create a content title = menu
        $parent = Article::where('title', 'menu')->first();
        $items = Article::query()->select('id')->where('parent_id', $parent->id)->defaultOrder()->get();
        
        return response()->json([
            'items' => $items
        ]);
    }


    public function show(Article $article)
    {
        $items = ArticleData::query()->where('article_id', $article->id)->defaultOrder()->get();

        return response()->json([
            'title' => $article->title,
            'items' => $items
        ]);
    }

}
