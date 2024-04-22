<?php

namespace App\Http\Controllers\Frontend;

use Illuminate\Http\Request;
use App\Services\ArticleService;
use App\Models\Article;


class FooterController extends Controller
{
    public function index($parentId = 0)
    {

        $items = Article::query()->where('parent_id', $parentId)->with(['descendants.articleSetting'])->defaultOrder()->get()->toTree();
        
        return response()->json(['items' => $items]);
    }

}
