<?php

namespace App\Http\Controllers\Frontend;

use Illuminate\Http\Request;
use App\Services\ArticleService;
use App\Models\Article;


class ArticleController extends Controller
{
    public function index()
    {
        \Log::info('index');
        // $articles = ArticleService::index($parentId);
        // return response()->json(['articles' => $articles]);
    }


    public function show(Article $article)
    {
        $article = ArticleService::show($article);
        return response()->json(['article' => $article]);
    }


}
