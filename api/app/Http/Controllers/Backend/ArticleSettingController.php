<?php

namespace App\Http\Controllers\Backend;

use Illuminate\Http\Request;
use App\Models\Article;
use App\Models\ArticleSetting;

class ArticleSettingController extends Controller
{

    public function update(Request $request,Article $article)
    {
        //\Log::info($request);
        // validation
        $data = $request->validate([
            'active' => 'required',
            'redirect_url' => 'sometimes',
            'published_start' => 'sometimes|date',
            'published_end' => 'sometimes|date|after_or_equal:published_start',
            'listing_type' => 'sometimes|string',
            'show_children' => 'sometimes|boolean',
        ]);

         // Merge article_id with the rest of the data
        $data = array_merge($data, [
                                    'user_id' => auth('sanctum')->user()->id,
                                    'article_id' => $article->id
                            ]);

        //\Log::info($data);
        // Update an existing record if it already exists, or create a new one
        $articleSetting = ArticleSetting::updateOrCreate(
            ['article_id' => $article->id], // Conditions to find the record
            $data // Data to update or create
        );
        
        // Check if the update was successful
        if ($articleSetting) {
            return response()->json(['message' => 'Article Asset successfully created']);
        } else {
            return response()->json(['message' => 'Article Asset update failed'], 500);
        }
    }

    public function show(Article $article){
        //\Log::info($article);
        if($article->articleSetting){
            return response()->json(['article_setting' => $article->articleSetting]);
        } else {
            return response()->json(['message' => 'Not found'],404);
        }
      
    }

}