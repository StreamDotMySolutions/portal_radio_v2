<?php

namespace App\Http\Controllers\Frontend;

use Illuminate\Http\Request;
use App\Models\Video;


class VideoController extends Controller
{
    public function index()
    {

        $items = Video::query()->defaultOrder()->get()->toTree();
        
        return response()->json(['items' => $items]);
    }

}
