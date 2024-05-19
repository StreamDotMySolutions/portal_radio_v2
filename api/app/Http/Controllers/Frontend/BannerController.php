<?php

namespace App\Http\Controllers\Frontend;

use Illuminate\Http\Request;
use App\Models\Banner;
use Carbon\Carbon;


class BannerController extends Controller
{
    public function index()
    {

        //$banners = Banner::query()->defaultOrder()->get()->toTree();
        $banners = [];
        
        //$currentDate = now()->toDateString(); // Get the current date in 'Y-m-d' format
        $currentDate = Carbon::now();

        $banners = Banner::query()
            ->where('active', 1)
            ->defaultOrder()
            ->get()
            ->map(function ($banner) use ($currentDate) {
              
                    if ($banner->published_end != null) {
            
                        $publishedEndDateTime = Carbon::parse($banner->published_end);

                        if($publishedEndDateTime->timestamp >= $currentDate->timestamp){
                       
                            return $banner; // only return if publsihed_end >= currentDate
                        }
                    } else {
                        return $banner; // if published_end null, return as it is
                    }
                })
                ->filter(); // remove empty array
        
        return response()->json(['banners' => $banners]);
    }

}
