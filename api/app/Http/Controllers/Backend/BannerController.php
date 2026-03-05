<?php

namespace App\Http\Controllers\Backend;

use Illuminate\Http\Request;
use App\Models\Banner;
use App\Services\CommonService;
use Carbon\Carbon;

class BannerController extends Controller
{

    public function index(Request $request){

        $query = Banner::defaultOrder();

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where('title', 'like', "%{$search}%");
        }

        if ($request->has('active') && $request->input('active') !== '') {
            $query->where('active', $request->input('active'));
        }

        $banners = $query->paginate(10)->withQueryString();

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

    public function update(Request $request, Banner $banner)
    {
        $request->validate([
            'title'          => 'sometimes|string',
            'description'    => 'sometimes|string',
            'active'         => 'sometimes|boolean',
            'published_start'=> 'sometimes|date',
            'published_end'  => 'sometimes|date|after_or_equal:published_start',
            'banner'         => 'sometimes|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $data = $request->only(['title', 'description', 'redirect_url', 'active', 'published_start', 'published_end']);

        if ($request->hasFile('banner')) {
            if ($banner->filename) {
                CommonService::handleDeleteFile($banner->filename, 'banners');
            }
            $data['filename'] = CommonService::handleStoreFile($request->file('banner'), 'banners');
        }

        $banner->update($data);

        return response()->json(['message' => 'Banner successfully updated']);
    }

    public function delete(Request $request,Banner $banner){

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

    public function toggle(Banner $banner)
    {
        $banner->update(['active' => $banner->active == 1 ? 0 : 1]);
        return response()->json(['message' => 'Banner updated successfully']);
    }

}