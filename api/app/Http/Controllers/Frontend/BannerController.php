<?php

namespace App\Http\Controllers\Frontend;

use Illuminate\Http\Request;
use App\Models\Banner;


class BannerController extends Controller
{
    public function index()
    {

        $banners = Banner::query()->defaultOrder()->get()->toTree();
        
        return response()->json(['banners' => $banners]);
    }

}
