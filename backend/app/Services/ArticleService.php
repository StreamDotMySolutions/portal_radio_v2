<?php
namespace App\Services;

use App\Models\Article;
use Illuminate\Http\Request;

class ArticleService
{

    public static function index($parentId)
    {
        if (!is_null($parentId) && !empty($parentId)) {
            $paginate = Article::query()->where('parent_id', $parentId);
        } else {
            $paginate = Article::query()->where('parent_id', null);;
        }
        

        $articles = $paginate->with('ancestors')->defaultOrder()->paginate(30)->withQueryString();   
        
        //  $articles = $paginate->with('ancestors')->defaultOrder()->paginate(30)->withQueryString()->toTree();   
        //$articles = Article::defaultOrder()->get()->toTree();

        return $articles;
    }

    public static function store(Request $request)
    {        
        $article = Article::create([
            'title' => $request->input('title') ,
        ]);

        // append parent id to node
        
        if ($request->has('parent_id')) {
            $parentId = $request->input('parent_id'); 

            if (!is_null($parentId) && !empty($parentId)) {
                $node = Article::find($parentId); // find the node
                $node->appendNode($article); // assign created article to that node
            } 
        }

        return $article;
    }

    public static function update(Request $request, $article)
    {
        return Article::where('id', $article->id)->update($request->except(['_method','id']));
    }

    public static function show($article)
    {
        $article = Article::where('id',$article->id)->first();
        return $article;
    }

    public static function delete($article)
    {
        return $article->delete();
    }
}
