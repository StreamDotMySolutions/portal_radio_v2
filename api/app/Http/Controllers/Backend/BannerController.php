<?php

namespace App\Http\Controllers\Backend;

use Illuminate\Http\Request;
use App\Models\Banner;
use App\Services\CommonService;
use Carbon\Carbon;

class BannerController extends Controller
{

    public function index(){

        //$banners = Banner::defaultOrder()->get();
        $banners = Banner::defaultOrder()->paginate(10)->withQueryString(); 

        if ($banners->isEmpty()) {
            return response()->json(['message' => 'No banners found'], 404);
        }
    
        return response()->json(['banners' => $banners]);

    }

    public function show(Banner $banner){
        return response()->json(['banner' => $banner]);
    }

    public function store(Request $request){
        // validation
        $request->validate([
            'title' => 'required|string',
            'description' => 'required|string',
            'active' => 'required|boolean',
            'published_start' => 'sometimes|date',
            'published_end' => 'sometimes|date|after_or_equal:published_start',
            'banner' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        if($request->has('banner')){
            //\Log::info($request);
            $banner = Banner::create([
                'user_id' =>  auth('sanctum')->user()->id,
                'title' => $request->input('title'),
                'description' => $request->input('description'),
                'redirect_url' => $request->input('redirect_url'),
                'active' => $request->input('active'),
                'published_start' => $request->input('published_start') ?? Carbon::now(),
                'published_end' => $request->input('published_end'),
                'filename' => CommonService::handleStoreFile($request->file('banner'), $directory = 'banners'),
            ]);

            if (!$banner) {
                return response()->json(['message' => 'Banner creation failed'], 500);
            }
        
            return response()->json(['message' => 'Banner creation success']);
        }
    }

    public function update(Request $request,Banner $banner)
    {

        //\Log::info($request);
        // validation
        $data = $request->validate([
            'title' => 'sometimes|string',
            'description' => 'sometimes|string',
            'active' => 'sometimes|boolean',
            'published_start' => 'sometimes|date',
            'published_end' => 'sometimes|date|after_or_equal:published_start',
            //'banner' => 'sometimes|image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        $banner = Banner::where('id', $banner->id)->update($request->except(['_method','id']));

        // Check if the update was successful
        if ($banner) {
            return response()->json(['message' => 'Banner successfully created']);
        } else {
            return response()->json(['message' => 'Banner update failed'], 500);
        }
    }

    public function delete(Request $request,Banner $banner){

        $data = $request->validate([
            'acknowledge' => 'required',
        ]);

        //\Log::info($banner);
        CommonService::handleDeleteFile($banner->filename, $directory = 'banners');

        if ( $banner->delete() ) {
            return response()->json(['message' => 'Banner successfully deleted']);
        } else {
            return response()->json(['message' => 'Banner delete failed'], 500);
        }
        
    }

    public function ordering(Banner $banner, Request $request)
    {
        //\Log::info($request);
        // reference https://github.com/lazychaser/laravel-nestedset
        switch($request->input('direction')){
            case 'up':
                $banner->up(); // banner ordering up
                break;
            case 'down':
                $banner->down(); //  // banner ordering down
            break;
        }
        
    }

}