<?php
namespace App\Services;

use App\Models\Article;
use Illuminate\Http\Request;


class ArticleService
{

    public static function index()
    {
        $paginate = Article::query();
        $articles = $paginate->orderBy('id','DESC')->paginate(10)->withQueryString();     
        return $articles;
    }

    public static function store(Request $request)
    {        
        $article = Article::create([
            'title' => $request->input('title') ,
        ]);
        return $article;
    }

    public static function update(Request $request, $article)
    {
        return Article::where('id', $article->id)->update($request->except(['_method','id']));
    }

    public static function show($role)
    {
        $article = Article::where('id',$article->id)->first();
        return $article;
    }

    public static function delete($article)
    {
        return $article->delete();
    }
}
