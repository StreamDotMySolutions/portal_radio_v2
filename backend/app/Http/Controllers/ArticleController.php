<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\ArticleService;
use App\Http\Requests\Articles\StoreRequest;
use App\Http\Requests\Articles\UpdateRequest;
use App\Http\Requests\Articles\DeleteRequest;

class ArticleController extends Controller
{
    public function index()
    {
        $articles = ArticleService::index();
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
}
