<?php

namespace App\Http\Controllers\Backend;

use Illuminate\Http\Request;
use App\Models\Asset;
use App\Services\CommonService;

class AssetController extends Controller
{

    public function index(){

        $assets = Asset::defaultOrder()->paginate(10)->withQueryString(); 
        return response()->json(['assets' => $assets]);
    }

    public function show(Asset $asset){
        return response()->json(['asset' => $asset]);
    }

    public function store(Request $request){
        // validation
        $request->validate([
            'name' => 'required',

        ]);

     
        //\Log::info($request);
        $asset = Asset::create([
            'user_id' =>  auth('sanctum')->user()->id,
            'name' => $request->input('name'),
            //'filename' => CommonService::handleStoreFile($request->file('poster'), $directory = 'assets'),
        ]);

        if (!$asset) {
            return response()->json(['message' => 'Asset creation failed'], 500);
        }
    
        return response()->json(['message' => 'Asset creation success']);
        
    }

    public function update(Request $request,Asset $asset)
    {
        // validation
        $data = $request->validate([
            'name' => 'sometimes',
            //'poster' => 'sometimes|image|mimes:jpeg,png,jpg,gif'
        ]);

        // $asset = Asset::where('id', $asset->id)->update(
        //     $request->except(['_method','id'])
        // );
         // Prepare the data array for updating
        $updateData = [
            'user_id' => auth('sanctum')->user()->id,
            'name' => $request->input('name'),
        ];

        // Conditionally add 'filename' if 'poster' is present in the request
        // if ($request->hasFile('poster')) {
        //     $updateData['filename'] = CommonService::handleStoreFile($request->file('poster'), 'assets');
        // }

        // Perform the update
        $asset->where('id', $asset->id)->update($updateData);

        // Check if the update was successful
        if ($asset) {
            return response()->json(['message' => 'Asset successfully created']);
        } else {
            return response()->json(['message' => 'Asset update failed'], 500);
        }
    }

    public function delete(Request $request,Asset $asset){

        $data = $request->validate([
            'acknowledge' => 'required',
        ]);

        //CommonService::handleDeleteFile($asset->filename, $directory = 'assets');


        if ( $asset->delete() ) {
            return response()->json(['message' => 'Asset successfully deleted']);
        } else {
            return response()->json(['message' => 'Asset delete failed'], 500);
        }
        
    }

    public function ordering(Asset $asset, Request $request)
    {
        // reference https://github.com/lazychaser/laravel-nestedset
        switch($request->input('direction')){
            case 'up':
                $asset->up(); // asset ordering up
                break;
            case 'down':
                $asset->down(); //  // asset ordering down
            break;
        }
        
    }

}