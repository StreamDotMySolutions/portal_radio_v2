<?php

namespace App\Http\Controllers\Backend;

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

    public function show(ArticleData $articleData)
    {
        $articleData = ArticleDataService::show($articleData);
        return response()->json(['article_data' => $articleData]);
    }

    public function update(UpdateRequest $request, ArticleData $articleData)
    {
        //\Log::info($request);
        ArticleDataService::update($request, $articleData);
        return response()->json(['message' => 'Article successfully updated']);
    }

    public function delete(DeleteRequest $request, ArticleData $articleData)
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
