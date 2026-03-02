<?php

namespace App\Http\Controllers\Backend;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use App\Models\Vod;
use App\Services\CommonService;
use App\Jobs\VodJob;

class VodController extends Controller
{

    public function index(Request $request, $parentId){

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query = Vod::query()->where('name', 'like', "%{$search}%");
        } elseif (!is_null($parentId) && !empty($parentId)) {
            $query = Vod::query()->where('parent_id', $parentId);
        } else {
            $query = Vod::query()->whereNull('parent_id');
        }

        $vods = $query->with(['descendants'])->defaultOrder()->paginate(10)->withQueryString();

        return response()->json(['vods' => $vods]);
    }

    
    public function listVideos(){

        $vods = Vod::query()->where('type', 'file')->get();
        return response()->json(['vods' => $vods]);
    }

    public function show(Vod $vod){
        if ($vod->type === 'folder') {
            $vod->load(['descendants' => fn($q) => $q->defaultOrder()]);
        }
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
            // validate, only accepts any video
            $request->validate([
                'name' => 'required|file|mimetypes:video/*'
            ]);

            $file = $request->file('name');

            // create a record in database
            $vod = Vod::create([
                'user_id'  => auth('sanctum')->user()->id,
                'type'     => 'file',
                'name'     => CommonService::handleStoreFile($file, $directory = 'vods'),
                'mimetype' => $file->getMimeType(),
                'filesize' => $file->getSize(),
            ]);

            // Pass the $vod->name to Job Worker
            dispatch(new VodJob($vod));
            //\Log::info($vod->name);
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

    public function update(Request $request, Vod $vod)
    {
        $request->validate([
            'name'   => 'sometimes|string',
            'rename' => 'sometimes|string',
        ]);

        $updateData = ['user_id' => auth('sanctum')->user()->id];

        if ($vod->type === 'folder') {
            $updateData['name'] = $request->input('name');
        }

        if ($vod->type === 'file' && $request->filled('rename')) {
            $ext     = pathinfo($vod->name, PATHINFO_EXTENSION);
            $newName = Str::slug(pathinfo($request->input('rename'), PATHINFO_FILENAME)) . '.' . $ext;

            if ($newName !== $vod->name) {
                Storage::disk('public')->move("vods/{$vod->name}", "vods/{$newName}");
                $updateData['name'] = $newName;
            }
        }

        $vod->where('id', $vod->id)->update($updateData);

        return response()->json(['message' => 'Vod successfully updated']);
    }

    public function delete(Request $request,Vod $vod){

        $data = $request->validate([
            'acknowledge' => 'required',
        ]);

        if($vod->type == 'file'){
            //\Log::info( $vod->name . ' file deleted');
            CommonService::handleDeleteFile($vod->name, $directory = 'vods');
           

            $storagePath = storage_path('public/');
            $outputDir = 'vods/' . $vod->id;

            // delete the playlist folder
            Storage::disk('public')->deleteDirectory($outputDir);

        }
        
        if ( $vod->delete() ) {
            return response()->json(['message' => 'Vod successfully deleted']);
        } else {
            return response()->json(['message' => 'Vod delete failed'], 500);
        }
        
    }

    public function ordering(Vod $vod, Request $request)
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