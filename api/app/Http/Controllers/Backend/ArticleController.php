<?php

namespace App\Http\Controllers\Backend;

use Illuminate\Http\Request;
use App\Services\ArticleService;
use App\Models\Article;
use App\Http\Requests\Articles\StoreRequest;
use App\Http\Requests\Articles\UpdateRequest;
use App\Http\Requests\Articles\DeleteRequest;
use App\Http\Requests\Articles\OrderingRequest;

class ArticleController extends Controller
{
    public function tree()
    {
        $tree = Article::defaultOrder()->get(['id', 'title', 'type', 'parent_id', '_lft', '_rgt'])->toTree();
        return response()->json(['tree' => $tree]);
    }

    public function search(Request $request)
    {
        $q = trim($request->input('q', ''));

        if (strlen($q) < 2) {
            return response()->json(['results' => []]);
        }

        $byTitle = Article::where('title', 'LIKE', "%{$q}%")
            ->get(['id', 'title', 'type', 'parent_id']);

        $byContent = Article::whereHas('articleData', fn($sq) => $sq->where('contents', 'LIKE', "%{$q}%"))
            ->get(['id', 'title', 'type', 'parent_id']);

        $results = $byTitle->merge($byContent)->unique('id')->values();

        return response()->json(['results' => $results]);
    }

    public function index(Request $request, $parentId)
    {
        if ($request->filled('search')) {
            $query = Article::query()->where('title', 'like', "%{$request->input('search')}%");
        } elseif (!is_null($parentId) && !empty($parentId)) {
            $query = Article::query()->where('parent_id', $parentId);
        } else {
            $query = Article::query()->where('parent_id', null);
        }

        $sortBy  = $request->input('sort_by');
        $sortDir = $request->input('sort_dir', 'desc');

        if ($sortBy === 'date') {
            $query->orderBy('created_at', $sortDir);
        } elseif ($sortBy === 'name') {
            $query->orderBy('title', $sortDir);
        } else {
            $query->defaultOrder();
        }

        $allowed = [10, 25, 50, 100];
        $perPage = (int) $request->input('per_page', 25);
        if (!in_array($perPage, $allowed)) {
            $perPage = 25;
        }

        $foldersCount = (clone $query)->where('type', 'folder')->count();
        $pagesCount   = (clone $query)->where('type', '!=', 'folder')->count();

        $articles = $query->with(['articleSetting', 'descendants'])->withCount('analyticsViews')->paginate($perPage)->withQueryString();

        return response()->json([
            'articles'      => $articles,
            'folders_count' => $foldersCount,
            'pages_count'   => $pagesCount,
        ]);
    }


    public function articlesData($parentId)
    {
        //\Log::info($parentId);
        $articles = ArticleService::articlesData($parentId);
        return response()->json(['articles' => $articles]);
    }
    public function store(StoreRequest $request)
    {
        //\Log::info($request);
        ArticleService::store($request);
        return response()->json(['message' => 'Article successfully created']);
    }

    public function show(Article $article)
    {
        $article = ArticleService::show($article);
        return response()->json(['article' => $article]);
    }

    public function update(UpdateRequest $request, Article $article)
    {
        //\Log::info($request);
        ArticleService::update($request, $article);
        return response()->json(['message' => 'Article successfully updated']);
    }

    public function delete(DeleteRequest $request, Article $article)
    {
        ArticleService::delete($article);
        return response()->json(['message' => 'Article successfully deleted']);
    }

    public function ordering(Article $article, OrderingRequest $request)
    {
        // reference https://github.com/lazychaser/laravel-nestedset
        switch($request->input('direction')){
            case 'up':
                $article->up(); // article ordering up
                break;
            case 'down':
                $article->down(); //  // article ordering down
            break;
        }
        
    }
}
