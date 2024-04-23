<?php

namespace App\Http\Controllers\Frontend;

use Illuminate\Http\Request;
use App\Services\ArticleService;
use App\Models\Article;
use App\Models\ArticleData;


class ArticleController extends Controller
{
    public function index($parentId = 0)
    {

        $articles = Article::query()->where('parent_id', $parentId)->with(['articleSetting','descendants.articleSetting'])->defaultOrder()->get()->toTree();
        
        return response()->json(['articles' => $articles]);
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
