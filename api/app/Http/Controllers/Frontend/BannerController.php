<?php

namespace App\Http\Controllers\Frontend;

use Illuminate\Http\Request;
use App\Models\Banner;


class BannerController extends Controller
{
    public function index()
    {

        //$banners = Banner::query()->defaultOrder()->get()->toTree();
    
        
        $currentDate = now()->toDateString(); // Get the current date in 'Y-m-d' format

        $banners = Banner::where('active', 1)
            ->where(function ($query) use ($currentDate) {
                $query->whereNull('published_start')->orWhereDate('published_start', '>=', $currentDate);
            })
            ->where(function ($query) use ($currentDate) {
                $query->whereNull('published_end')->orWhereDate('published_end', '<=', $currentDate);
            })
            ->defaultOrder()
            ->get();
        
        return response()->json(['banners' => $banners]);
    }

}
