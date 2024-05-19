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
              
                //\Log::info($banner->published_end);
                    if ($banner->published_end != null) {
                        //\Log::info('publsihed_end not null');
                        $publishedEndDateTime = Carbon::parse($banner->published_end);
                        if($publishedEndDateTime->timestamp >= $currentDate->timestamp){
                            //\Log::info('valid');
                            return $banner;
                        }
                    } else {
                        //\Log::info('valid');
                        return $banner;
                    }
                });
    
    //\Log::info($test->filter()); // Filter out null values

          
        
        return response()->json(['banners' => $banners]);
    }

}
