<?php

namespace App\Http\Controllers\Backend;

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

    public function show(ArticleContent $articleContent){
        //\Log::info($articleContent);
        return response()->json(['article_content' => $articleContent]);    
    }

    public function store(StoreRequest $request)
    {
        /**
         * create Article node
         * Article hasOne ArticleContent
         * create ArticleContent
         */
        //\Log::info($request);
        
        $article = ArticleService::store($request); // create Article node based on given parent_id
        ArticleContentService::store($article->id,$request->input('contents'));
        return response()->json(['message' => 'Article Content successfully created']);
    }

    public function update(UpdateRequest $request, ArticleContent $articleContent)
    {
        //\Log::info($request);
        //\Log::info($articleContent);

        ArticleContentService::update($request,$articleContent);
        return response()->json(['message' => 'Article Content successfully created']);

    }

    public function delete(ArticleContent $articleContent)
    {
     
        ArticleContentService::delete($articleContent);
        return response()->json(['message' => 'Article Content successfully deleted']);

    }
    
}
