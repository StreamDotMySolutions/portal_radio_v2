<?php
namespace App\Services;

use App\Models\ArticleData;
use Illuminate\Http\Request;

class ArticleDataService
{

    // public static function index($parentId)
    // {
    //     if (!is_null($parentId) && !empty($parentId)) {
    //         $paginate = ArticleData::query()->where('parent_id', $parentId);
    //     } else {
    //         $paginate = ArticleData::query()->where('parent_id', null);;
    //     }
        

    //     $articles = $paginate->with('ancestors')->defaultOrder()->paginate(30)->withQueryString();   
        
    //     //  $articles = $paginate->with('ancestors')->defaultOrder()->paginate(30)->withQueryString()->toTree();   
    //     //$articles = Article::defaultOrder()->get()->toTree();

    //     return $articles;
    // }
    
    public static function index($parentId)
    {
     
        $paginate = ArticleData::query()->where('article_id', $parentId);
        $articles = $paginate->with('ancestors')->defaultOrder()->get();
        
        return $articles;
    }
    public static function store(Request $request)
    {        
        $user =  auth('sanctum')->user();
        $articleData = ArticleData::create([
            'article_id' => $request->input('parent_id'),
            'title' => $request->input('title'),
            'contents' => $request->input('contents'),
            'user_id' => $user->id
        ]);

        return $articleData;
    }

    public static function update(Request $request, $articleData)
    {
        return ArticleData::where('id', $articleData->id)->update($request->except(['_method','id']));
    }

    public static function show($articleData)
    {
        $data = ArticleData::with(['ancestors'])->where('id',$articleData->id)->first();
        return $data;
    }

    public static function delete($articleData)
    {
        return $articleData->delete();
    }
}
