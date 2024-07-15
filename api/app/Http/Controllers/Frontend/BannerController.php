<?php

namespace App\Http\Controllers\Frontend;

use Illuminate\Http\Request;
use App\Models\Banner;
use Carbon\Carbon;

class BannerController extends Controller
{
    public function index()
    {
        $currentDate = Carbon::now();

        $banners = Banner::query()
            ->where('active', 1)
            ->where(function ($query) use ($currentDate) {
                $query->whereNull('published_end')
                      ->orWhere('published_end', '>=', $currentDate);
            })
            ->defaultOrder()
            ->get();

        return response()->json(['banners' => $banners]);
    }
}
