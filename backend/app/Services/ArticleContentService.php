<?php
namespace App\Services;

use App\Models\ArticleContent;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ArticleContentService
{
    public static function store($articleId, $contents)
    {        
        $articleContent = new \App\Models\ArticleContent([
            'user_id' =>  auth('sanctum')->user()->id,
            'article_id' => $articleId,
            'contents' => $contents,
        ]);

        // Save the PageImage instance to the database
        return $articleContent->save(); 
    }

    public static function update($request, $articleContent)
    {
        return ArticleContent::where('id', $articleContent->id)->update($request->except(['_method','id']));
    }


    public static function delete($articleContent)
    {
        return $articleContent->delete();
    }
}
