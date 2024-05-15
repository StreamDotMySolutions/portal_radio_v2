<?php

namespace App\Http\Controllers\Backend;

use Illuminate\Http\Request;
use App\Models\Video;
use App\Services\CommonService;


class VideoController extends Controller
{

    public function index(){

        $videos = Video::defaultOrder()->paginate(10)->withQueryString(); 
        return response()->json(['videos' => $videos]);
    }

    public function show(Video $video){
        return response()->json(['video' => $video]);
    }

    public function store(Request $request){
        // validation
        $request->validate([
            'title' => 'required',
            'embed_code' => 'required',
            'poster' => 'required|image|mimes:jpeg,png,jpg,gif'
        ]);

     
        //\Log::info($request);
        $video = Video::create([
            'user_id' =>  auth('sanctum')->user()->id,
            'title' => $request->input('title'),
            'embed_code' => $request->input('embed_code'),
            'filename' => CommonService::handleStoreFile($request->file('poster'), $directory = 'videos'),
        ]);

        if (!$video) {
            return response()->json(['message' => 'Video creation failed'], 500);
        }
    
        return response()->json(['message' => 'Video creation success']);
        
    }

    public function update(Request $request,Video $video)
    {
        // validation
        $data = $request->validate([
            'title' => 'sometimes',
            'embed_code' => 'sometimes',
        ]);

        $video = Video::where('id', $video->id)->update($request->except(['_method','id']));

        // Check if the update was successful
        if ($video) {
            return response()->json(['message' => 'Video successfully created']);
        } else {
            return response()->json(['message' => 'Video update failed'], 500);
        }
    }

    public function delete(Request $request,Video $video){

        $data = $request->validate([
            'acknowledge' => 'required',
        ]);

        CommonService::handleDeleteFile($video->filename, $directory = 'videos');


        if ( $video->delete() ) {
            return response()->json(['message' => 'Video successfully deleted']);
        } else {
            return response()->json(['message' => 'Video delete failed'], 500);
        }
        
    }

    public function ordering(Video $video, Request $request)
    {
        // reference https://github.com/lazychaser/laravel-nestedset
        switch($request->input('direction')){
            case 'up':
                $video->up(); // video ordering up
                break;
            case 'down':
                $video->down(); //  // video ordering down
            break;
        }
        
    }

}