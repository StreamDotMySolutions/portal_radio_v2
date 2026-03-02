<?php

namespace App\Http\Controllers\Backend;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use App\Models\Asset;
use App\Services\CommonService;

class AssetController extends Controller
{

    public function index(Request $request, $parentId){

        $query = !is_null($parentId) && !empty($parentId)
            ? Asset::query()->where('parent_id', $parentId)
            : Asset::query()->whereNull('parent_id');

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where('name', 'like', "%{$search}%");
        }

        $assets = $query->with(['descendants'])->defaultOrder()->paginate(10)->withQueryString();

        return response()->json(['assets' => $assets]);
    }

    public function show(Asset $asset){
        if ($asset->type === 'folder') {
            $asset->load(['descendants' => fn($q) => $q->defaultOrder()]);
        }
        return response()->json(['asset' => $asset]);
    }

    public function store(Request $request){
        // validation
        $request->validate([
            'name' => 'required',
            'type' => 'required',
        ]);

     
        //\Log::info($request);

        if($request->input('type') == 'folder'){
            $asset = Asset::create([
                'user_id' =>  auth('sanctum')->user()->id,
                'name' => $request->input('name'),
                'type' => 'folder',
                //'filename' => CommonService::handleStoreFile($request->file('poster'), $directory = 'assets'),
            ]);
        }

        if($request->input('type') == 'file'){
            $file = $request->file('name');
            $asset = Asset::create([
                'user_id'  => auth('sanctum')->user()->id,
                'type'     => 'file',
                'name'     => CommonService::handleStoreFile($file, $directory = 'assets'),
                'mimetype' => $file->getMimeType(),
                'filesize' => $file->getSize(),
            ]);
        }



        // append parent id to node
        if ($request->has('parent_id')) {
            $parentId = $request->input('parent_id'); 

            if (!is_null($parentId) && !empty($parentId)) {
                $node = Asset::find($parentId); // find the node
                $node->appendNode($asset); // assign created asset to that node
            } 
        }

        if (!$asset) {
            return response()->json(['message' => 'Asset creation failed'], 500);
        }
    
        return response()->json(['message' => 'Asset creation success']);
        
    }

    public function update(Request $request, Asset $asset)
    {
        $request->validate([
            'name'   => 'sometimes|string',
            'rename' => 'sometimes|string',
            'file'   => 'sometimes|file|mimes:pdf,doc,docx,ppt,pptx,jpeg,jpg,png,gif,webp',
        ]);

        $updateData = ['user_id' => auth('sanctum')->user()->id];

        if ($asset->type === 'folder') {
            $updateData['name'] = $request->input('name');
        }

        if ($asset->type === 'file') {

            // Rename file on disk
            if ($request->filled('rename')) {
                $ext     = pathinfo($asset->name, PATHINFO_EXTENSION);
                $newName = Str::slug(pathinfo($request->input('rename'), PATHINFO_FILENAME)) . '.' . $ext;

                if ($newName !== $asset->name) {
                    Storage::disk('public')->move("assets/{$asset->name}", "assets/{$newName}");
                    $updateData['name'] = $newName;
                }
            }

            // Replace file content
            if ($request->hasFile('file')) {
                $currentName = $updateData['name'] ?? $asset->name;
                CommonService::handleDeleteFile($currentName, 'assets');
                $file = $request->file('file');
                $updateData['name']     = CommonService::handleStoreFile($file, 'assets');
                $updateData['mimetype'] = $file->getMimeType();
                $updateData['filesize'] = $file->getSize();
            }
        }

        $asset->where('id', $asset->id)->update($updateData);

        return response()->json(['message' => 'Asset successfully updated']);
    }

    public function delete(Request $request,Asset $asset){

        $data = $request->validate([
            'acknowledge' => 'required',
        ]);

        if($asset->type == 'file'){
            CommonService::handleDeleteFile($asset->name, $directory = 'assets');
        }
        
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