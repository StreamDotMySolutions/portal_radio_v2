<?php

namespace App\Http\Controllers\Frontend;

use Illuminate\Http\Request;
use App\Services\ArticleService;
use App\Models\Article;
use App\Models\ArticleSetting;
use App\Models\ArticleData;
use Carbon\Carbon;


class ArticleController extends Controller
{
    public function index($parentId = 0)
    {

        $parent = Article::where('id', $parentId)->with(['articleSetting'])->first();
        $articles = Article::query()->where('parent_id', $parentId)->with(['articleSetting','descendants.articleSetting'])->defaultOrder()->get()->toTree();
        
        return response()->json([
        
            'title' => $parent->title,
            'settings' => $parent->articleSetting, 
            'articles' => $articles,
        
        ]);
    }

    public function listings($parentId = 0)
    {

        $parent = Article::where('id', $parentId)->with(['articleSetting'])->first();

        $articles = Article::query()
                        ->where('parent_id', $parentId)
                        ->whereHas('articleSetting', function ($query) {
                            $query->where('active', 1)
                                  ->where(function ($query) {
                                      $query->whereNull('published_start')
                                            ->orWhere('published_start', '<=', Carbon::now());
                                  })
                                  ->where(function ($query) {
                                    $query->whereNull('published_end')
                                          ->orWhere('published_end', '>=', Carbon::now());
                                  });
                        })
                        ->with(['articlePoster','articleSetting','descendants.articleSetting'])
                        ->orderBy('id', 'DESC')
                        ->defaultOrder()
                        ->paginate(6);

        $ancestors = Article::query()
                        //->select(['name','id'])
                        ->where('id', $parentId)
                        ->with(['ancestors'])
                        ->first();                

        
        return response()->json([
        
            'title' => $parent->title,
            'settings' => $parent->articleSetting, 
            'articles' => $articles,
            'ancestors' => $ancestors
        
        ]);
    }


    public function show(Article $article)
    {

        // check publish
        // $isPublished = ArticleSetting::isPublished($article->id);
        // \Log::info($isPublished);

        // find depth of given $article
        $result = Article::withDepth()->find($article->id);
        $depth = $result->depth;
        //\Log::info($depth);

        $settings = ArticleSetting::where('article_id',$article->id)->first();
        
        // get the ancestors
        // $depth minus 1 is to get ancestor 1 step above
        $ancestors = Article::withDepth()->having('depth', '=', ($depth - 1))->defaultOrder()->ancestorsOf($article->id);

        // get the items based on $article->id from ArticleData table
        $items = ArticleData::query()
                            ->where('article_id', $article->id)
                            ->defaultOrder()
                            ->get();

        return response()->json([
            'title' => $article->title,
            'settings' => $settings,
            'ancestors' => $ancestors,
            'items' => $items
        ]);
    }

}
