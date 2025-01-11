<?php

namespace App\Http\Controllers\Backend;

use Illuminate\Http\Request;
use App\Services\ArticleGalleryService;
use App\Models\Article;
use App\Models\ArticleGallery;

class ArticleGalleryController extends Controller
{
    public function index($article_data_id)
    {
        //\Log::info($articleId);
        $article_galleries = ArticleGalleryService::index($article_data_id);
        return response()->json(['article_galleries' => $article_galleries]);
    }

    public function store(Request $request)
    {
        //\Log::info($request);
        ArticleGalleryService::store($request);
        return response()->json(['message' => 'Article Gallery successfully created']);
    }

    public function delete(ArticleGallery $articleGallery)
    {
        //\Log::info($articleAsset);
        ArticleGalleryService::delete($articleGallery);
        return response()->json(['message' => 'Article Gallery successfully deleted']);
    }

}