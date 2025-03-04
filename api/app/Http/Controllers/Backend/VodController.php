<?php

namespace App\Http\Controllers\Backend;

use Illuminate\Http\Request;
use App\Models\Vod;
use App\Services\CommonService;

class VodController extends Controller
{

    public function index($parentId){

       
        if (!is_null($parentId) && !empty($parentId)) {
            $paginate = Vod::query()->where('parent_id', $parentId);
        } else {
            $paginate = Vod::query()->where('parent_id', null);;
        }
        

        $vods = $paginate->with(['descendants'])->defaultOrder()->paginate(10)->withQueryString();   

        return response()->json(['vods' => $vods]);
    }

    public function show(Vod $vod){
        return response()->json(['vod' => $vod]);
    }

    public function store(Request $request){
        // validation
        $request->validate([
            'name' => 'required',
            'type' => 'required',
        ]);

     
        //\Log::info($request);

        if($request->input('type') == 'folder'){
            $vod = Vod::create([
                'user_id' =>  auth('sanctum')->user()->id,
                'name' => $request->input('name'),
                'type' => 'folder',
                //'filename' => CommonService::handleStoreFile($request->file('poster'), $directory = 'vods'),
            ]);
        }

        if($request->input('type') == 'file'){
            $vod = Vod::create([
                'user_id' =>  auth('sanctum')->user()->id,
                'type' => 'file',
                'name' => CommonService::handleStoreFile($request->file('name'), $directory = 'vods'),
            ]);
        }



        // append parent id to node
        if ($request->has('parent_id')) {
            $parentId = $request->input('parent_id'); 

            if (!is_null($parentId) && !empty($parentId)) {
                $node = Vod::find($parentId); // find the node
                $node->appendNode($vod); // assign created vod to that node
            } 
        }

        if (!$vod) {
            return response()->json(['message' => 'Vod creation failed'], 500);
        }
    
        return response()->json(['message' => 'Vod creation success']);
        
    }

    public function update(Request $request,Asset $vod)
    {
        // validation
        $data = $request->validate([
            'name' => 'sometimes',
            //'poster' => 'sometimes|image|mimes:jpeg,png,jpg,gif'
        ]);

        // $vod = Asset::where('id', $vod->id)->update(
        //     $request->except(['_method','id'])
        // );
         // Prepare the data array for updating
        $updateData = [
            'user_id' => auth('sanctum')->user()->id,
            'name' => $request->input('name'),
        ];

        // Conditionally add 'filename' if 'poster' is present in the request
        // if ($request->hasFile('poster')) {
        //     $updateData['filename'] = CommonService::handleStoreFile($request->file('poster'), 'vods');
        // }

        // Perform the update
        $vod->where('id', $vod->id)->update($updateData);

        // Check if the update was successful
        if ($vod) {
            return response()->json(['message' => 'Vod successfully created']);
        } else {
            return response()->json(['message' => 'Vod update failed'], 500);
        }
    }

    public function delete(Request $request,Vod $vod){

        $data = $request->validate([
            'acknowledge' => 'required',
        ]);

        if($vod->type == 'file'){
            CommonService::handleDeleteFile($vod->name, $directory = 'vods');
        }
        
        if ( $vod->delete() ) {
            return response()->json(['message' => 'Vod successfully deleted']);
        } else {
            return response()->json(['message' => 'Vod delete failed'], 500);
        }
        
    }

    public function ordering(Asset $vod, Request $request)
    {
        // reference https://github.com/lazychaser/laravel-nestedset
        switch($request->input('direction')){
            case 'up':
                $vod->up(); // vod ordering up
                break;
            case 'down':
                $vod->down(); //  // vod ordering down
            break;
        }
        
    }

}