<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\ArticleDataService;
use App\Models\ArticleData;
use App\Http\Requests\ArticleData\StoreRequest;
use App\Http\Requests\ArticleData\UpdateRequest;
use App\Http\Requests\ArticleData\DeleteRequest;
use App\Http\Requests\ArticleData\OrderingRequest;

class ArticleDataController extends Controller
{
    public function index($parentId)
    {
        //\Log::info($parentId);
        $articles = ArticleDataService::index($parentId);
        return response()->json(['articles' => $articles]);
    }


    public function articlesData($parentId)
    {
        //\Log::info($parentId);
        $articles = ArticleDataService::articlesData($parentId);
        return response()->json(['articles' => $articles]);
    }
    public function store(StoreRequest $request)
    {
        //\Log::info($request);
        ArticleDataService::store($request);
        return response()->json(['message' => 'Article Data successfully created']);
    }

    public function show(ArticleData $article)
    {
        $article = ArticleDataService::show($article);
        return response()->json(['article' => $article]);
    }

    public function update(UpdateRequest $request, Article $article)
    {
        //\Log::info($request);
        ArticleDataService::update($request, $article);
        return response()->json(['message' => 'Article successfully updated']);
    }

    public function delete(DeleteRequest $request, Article $articleData)
    {
        ArticleDataService::delete($articleData);
        return response()->json(['message' => 'Article successfully deleted']);
    }

    public function ordering(ArticleData $articleData, OrderingRequest $request)
    {
        // reference https://github.com/lazychaser/laravel-nestedset
        switch($request->input('direction')){
            case 'up':
                $articleData->up(); // article ordering up
                break;
            case 'down':
                $articleData->down(); //  // article ordering down
            break;
        }
        
    }
}
