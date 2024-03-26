<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\ArticleService;
use App\Models\Article;
use App\Http\Requests\Articles\StoreRequest;
use App\Http\Requests\Articles\UpdateRequest;
use App\Http\Requests\Articles\DeleteRequest;
use App\Http\Requests\Articles\OrderingRequest;

class ArticleController extends Controller
{
    public function index($parentId)
    {
        //\Log::info($parentId);
        $articles = ArticleService::index($parentId);
        return response()->json(['articles' => $articles]);
    }

    public function store(StoreRequest $request)
    {
        //\Log::info($request);
        ArticleService::store($request);
        return response()->json(['message' => 'Role successfully created']);
    }

    public function show(Article $article)
    {
        $article = ArticleService::show($article);
        return response()->json(['article' => $article]);
    }

    public function update(UpdateRequest $request, Article $article)
    {
        //\Log::info('update');
        ArticleService::update($request, $article);
        return response()->json(['message' => 'Article successfully updated']);
    }

    public function delete(DeleteRequest $request, Article $article)
    {
        ArticleService::delete($article);
        return response()->json(['message' => 'Article successfully deleted']);
    }

    public function ordering(Article $article, OrderingRequest $request)
    {
        // reference https://github.com/lazychaser/laravel-nestedset
        switch($request->input('direction')){
            case 'up':
                $article->up(); // article ordering up
                break;
            case 'down':
                $article->down(); //  // article ordering down
            break;
        }
        
    }
}
