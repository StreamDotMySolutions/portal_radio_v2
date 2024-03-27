<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\ArticleAssetService;
use App\Models\Article;
use App\Models\ArticleAsset;

class ArticleAssetController extends Controller
{
    public function index(Article $article)
    {
        //\Log::info($articleId);
        $article_assets = ArticleAssetService::index($article);
        return response()->json(['article_assets' => $article_assets]);
    }

    public function store(Request $request)
    {
        //\Log::info($request);
        ArticleAssetService::store($request);
        return response()->json(['message' => 'Article Asset successfully created']);
    }

    public function delete(ArticleAsset $articleAsset)
    {
        //\Log::info($articleAsset);
        ArticleAssetService::delete($articleAsset);
        return response()->json(['message' => 'Article Asset successfully deleted']);
    }

}