<?php

namespace App\Http\Controllers\Frontend;

use Illuminate\Http\Request;
use App\Services\ArticleService;
use App\Models\Article;
use App\Models\ArticleData;
use App\Models\ArticleContent;


class MenuController extends Controller
{
    public function index()
    {

        // make sure create a content title = footer
        $parent = Article::where('title', 'MENU')->first();
        $items = Article::query()->select('id')->where('parent_id', $parent->id)->defaultOrder()->get();
        
        return response()->json([
            'items' => $items
        ]);

    }

    public function menu1()
    {

        // make sure create a content title = footer
        $parent = Article::where('title', 'MENU-1')->first();
        $items = Article::query()
                    ->where('parent_id', $parent->id)
                    ->with(['articleSetting'])
                    ->with(['descendants'])
                    ->defaultOrder()
                    ->get();
        
        return response()->json([
            'items' => $items
        ]);

    }

    public function menu2()
    {

        // make sure create a content title = footer
        $parent = Article::where('title', 'MENU-2')->first();
     
        $items = Article::query()
                        // ->withDepth()->having('depth', '=', 1)
                        ->with(['children','descendants', 'articleSetting' ])
                        ->where('parent_id', $parent->id)
                        ->defaultOrder()
                        ->get();
        
        
        return response()->json([
            'items' => $items
        ]);

    }

    public function sitemapSearch(Request $request)
    {
        $q = trim($request->input('q', ''));

        if (strlen($q) < 2) {
            return response()->json(['results' => []]);
        }

        $byTitle = Article::whereHas('articleSetting', fn($q) => $q->where('active', 1))
            ->where('title', 'LIKE', "%{$q}%")
            ->with(['articleSetting'])
            ->get(['id', 'title']);

        $byContent = Article::whereHas('articleSetting', fn($q) => $q->where('active', 1))
            ->whereHas('articleData', fn($sq) => $sq->where('contents', 'LIKE', "%{$q}%"))
            ->with(['articleSetting'])
            ->get(['id', 'title']);

        $results = $byTitle->merge($byContent)->unique('id')->values();

        return response()->json(['results' => $results]);
    }

    // public function sitemap()
    // {

    //     $menu1 = Article::where('title', 'MENU-1')->first();
    //     $tree = Article::with('children')
    //         ->select('id', 'title')
    //         ->where('parent_id', $menu1->id)
    //         ->get();

        

    //     return response()->json([
    //         'items' => $tree
    //     ]);

    // }

    public function sitemap()
    {
        $menu1  = Article::where('title', 'MENU-1')->first();
        $menu2  = Article::where('title', 'MENU-2')->first();
        $footer = Article::where('title', 'FOOTER')->first();

        $items = Article::defaultOrder()
            ->whereDescendantOrSelf($menu1)
            ->whereHas('articleSetting', fn($q) => $q->where('active', 1))
            ->get()
            ->merge(
                Article::defaultOrder()
                    ->whereDescendantOrSelf($menu2)
                    ->whereHas('articleSetting', fn($q) => $q->where('active', 1))
                    ->get()
            )
            ->merge(
                Article::defaultOrder()
                    ->whereDescendantOrSelf($footer)
                    ->whereHas('articleSetting', fn($q) => $q->where('active', 1))
                    ->get()
            );

        $tree = $items->toTree();

        return response()->json([
            'items' => $tree
        ]);
    }

}
