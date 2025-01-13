<?php

namespace App\Http\Controllers\Frontend;

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

}