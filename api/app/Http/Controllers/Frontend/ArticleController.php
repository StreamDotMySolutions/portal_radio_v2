<?php

namespace App\Http\Controllers\Frontend;

use Illuminate\Http\Request;
use App\Services\ArticleService;
use App\Models\Article;


class ArticleController extends Controller
{
    public function index($parentId = 0)
    {

        $articles = Article::query()->where('parent_id', $parentId)->with(['descendants.articleSetting'])->defaultOrder()->get()->toTree();
        
        return response()->json(['articles' => $articles]);
    }


    public function show(Article $article)
    {
        $article = ArticleService::show($article);
        return response()->json(['article' => $article]);
    }


}
