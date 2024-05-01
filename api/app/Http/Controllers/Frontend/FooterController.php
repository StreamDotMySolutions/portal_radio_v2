<?php

namespace App\Http\Controllers\Frontend;

use Illuminate\Http\Request;
use App\Services\ArticleService;
use App\Models\Article;
use App\Models\ArticleData;


class FooterController extends Controller
{
    public function index()
    {
        // make sure create a content title = menu
        $parent = Article::where('title', 'FOOTER')->first();
        
        return response()->json([
            'id' => $parent->id
        ]);
    }

}
