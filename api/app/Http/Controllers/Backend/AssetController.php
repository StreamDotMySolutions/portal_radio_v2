<?php

namespace App\Http\Controllers\Backend;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use App\Models\Asset;
use App\Models\AnalyticsEvent;
use App\Services\CommonService;

class AssetController extends Controller
{

    public function index(Request $request, $parentId){

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query = Asset::query()->where('name', 'like', "%{$search}%");
        } elseif (!is_null($parentId) && !empty($parentId)) {
            $query = Asset::query()->where('parent_id', $parentId);
        } else {
            $query = Asset::query()->whereNull('parent_id');
        }

        $assets = $query->with(['descendants'])
            ->addSelect(['downloads_count' => AnalyticsEvent::query()
                ->whereColumn('reference_title', 'assets.name')
                ->where('event_type', 'download')
                ->where('page_type', 'asset')
                ->selectRaw('count(*)')
            ])
            ->defaultOrder()->paginate(10)->withQueryString();

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
            'name'      => 'sometimes|string',
            'rename'    => 'sometimes|string',
            'file'      => 'sometimes|file|mimes:pdf,doc,docx,ppt,pptx,jpeg,jpg,png,gif,webp',
            'parent_id' => 'nullable|integer|exists:assets,id',
        ]);

        $updateData = ['user_id' => auth('sanctum')->user()->id];

        if ($asset->type === 'folder') {
            $updateData['name'] = $request->input('name');
            if ($request->filled('parent_id')) {
                $updateData['parent_id'] = $request->input('parent_id');
            }
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

    public function tree()
    {
        // Only show folders as potential parents, not files
        $tree = Cache::remember('backend.asset.tree', 86400, function () {
            $roots = Asset::whereIsRoot()->where('type', 'folder')->defaultOrder()->with(['children'])->get();
            return $roots->map(fn($root) => $this->buildTreeNode($root))->toArray();
        });
        return response()->json(['tree' => $tree]);
    }

    private function buildTreeNode(Asset $asset): array
    {
        // Only include folder children
        $folderChildren = $asset->children->filter(fn($child) => $child->type === 'folder');

        return [
            'id' => $asset->id,
            'name' => $asset->name,
            'type' => $asset->type,
            'children' => $folderChildren->map(fn($child) => $this->buildTreeNode($child))->toArray(),
        ];
    }

}