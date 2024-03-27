<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\ArticlePosterService;
use App\Models\ArticlePoster;
use App\Http\Requests\ArticlePosters\StoreRequest;
use App\Http\Requests\ArticlePosters\UpdateRequest;
use App\Http\Requests\ArticlePosters\DeleteRequest;
use App\Http\Requests\ArticlePosters\OrderingRequest;

class ArticlePosterController extends Controller
{

    public function store(StoreRequest $request)
    {
        //\Log::info($request);
        ArticlePosterService::store($request);
        return response()->json(['message' => 'Artcile Poster successfully created']);
    }

    public function delete(Request $request, ArticlePoster $articlePoster)
    {
        ArticlePosterService::delete($articlePoster);
        return response()->json(['message' => 'Article Poster successfully deleted']);
    }

    
}
