<?php
namespace App\Services;

use App\Models\Article;
use App\Models\ArticleSetting;
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
        

        $articles = $paginate->with(['articleSetting','descendants'])->defaultOrder()->paginate(10000)->withQueryString();   
        
        //  $articles = $paginate->with('ancestors')->defaultOrder()->paginate(30)->withQueryString()->toTree();   
        //$articles = Article::defaultOrder()->get()->toTree();

        return $articles;
    }
    
    public static function articlesData($parentId)
    {
        if (!is_null($parentId) && !empty($parentId)) {
            $paginate = Article::query()->where('parent_id', $parentId);
        } else {
            $paginate = Article::query()->where('parent_id', null);;
        }
        
        $articles = $paginate->with('ancestors','articleContent')->defaultOrder()->get();
        
        return $articles;
    }
    public static function store(Request $request)
    {        
        $user =  auth('sanctum')->user();
        $article = Article::create([
            'title' => $request->input('title') ,
            'user_id' => $user->id
        ]);

        // populate default settings
        $settings = array(

            'user_id' => auth('sanctum')->user()->id,
            'article_id' => $article->id,
            'active' => FALSE,
            'show_children' => TRUE,
            'listing_type' => 'single_article'
            
        );

        // ArticleSetting
        $articleSetting = ArticleSetting::updateOrCreate(
            ['article_id' => $article->id], // Conditions to find the record
            $settings // Data to update or create
        );


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
        $data = Article::with(['ancestors','articlePoster','articleContent'])->where('id',$article->id)->first();
        return $data;
    }

    public static function delete($article)
    {

        // Delete the related ArticlePoster if it exists
        if ($article->articlePoster) {
            $article->articlePoster->delete(); // need to call articlePoster service and delete the files
        }

        // Delete the related ArticleContent if it exists
        if ($article->articleContent) {
            $article->articleContent->delete();
        }

        return $article->delete();
    }
}
