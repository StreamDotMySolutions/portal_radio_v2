<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\ArticleService;
use App\Services\ArticleContentService;
use App\Models\ArticleContent;
use App\Http\Requests\ArticleContents\StoreRequest;
use App\Http\Requests\ArticleContents\UpdateRequest;
use App\Http\Requests\ArticleContents\DeleteRequest;
use App\Http\Requests\ArticleContents\OrderingRequest;

class ArticleContentController extends Controller
{

    public function store(StoreRequest $request)
    {
        /**
         * create Article node
         * Article hasOne ArticleContent
         * create ArticleContent
         */
        \Log::info($request);
        
        $article = ArticleService::store($request); // create Article node based on given parent_id
        ArticleContentService::store($article->id,$request->input('contents'));
        return response()->json(['message' => 'Article Content successfully created']);
    }
    
}
