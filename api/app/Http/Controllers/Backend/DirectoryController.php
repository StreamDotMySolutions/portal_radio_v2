<?php

namespace App\Http\Controllers\Backend;

use Illuminate\Http\Request;
use App\Models\Directory;
use Illuminate\Support\Facades\DB;


class DirectoryController extends Controller
{
    public function index($id = null)
    {
        //\Log::info($id);
        $ancestors = [];
        $title = null;
        $perPage = 100;

        //\Log::info('test');

        if($id == 0 || $id == null ){
            $items = Directory::query()
                        ->whereIsRoot()
                        ->with(['descendants'])
                        ->defaultOrder()
                        ->paginate($perPage);

            //\Log::info('root');            
        } else {

            $node = Directory::find($id);
            //$ancestors = $node->ancestors;
            $ancestors = Directory::ancestorsAndSelf($id);
            // $ancestors = Directory::query()
            //             ->where('id', $id)
            //             ->with(['ancestors'])
            //             ->first();

            $items = Directory::query()
                        ->where('parent_id', $id)
                        ->with(['descendants'])
                        ->defaultOrder()
                        ->paginate($perPage);

            //$title = Directory::where('id',$id)->select(['name'])->first();
            $title = Directory::where('id', $id)->value('name');

        }

        return response()->json([
                'title' => $title,
                'ancestors' => $ancestors,
                'items' => $items,     
            ]);
    }

    /*
    *  Caller ~ https://script.google.com/home/projects/1WwqFh0h9adHtMmda6yogJVRh0OfBpdSZiBU40Nzfqc5LAsmNuu0y8x3h/edit?pli=1
    *  POST   var url = "https://portalrtm.streamdotmy.com/api/directories/01__Angkasapuri";
    */
    public function store(Request $request, $root)
    {
	    //\Log::info($request);
       
        // Find the node with the given root name
        $node = Directory::where('name', $root)->first();

        // If the node exists, delete it and all its descendants
        if ($node) {
            $node->delete();
        }

        // Optional: Reset AUTO_INCREMENT only if table is empty
        // if (Directory::count() === 0) {
        //     DB::statement("ALTER TABLE directories AUTO_INCREMENT = 1");
        // }

        $this->createCategoryWithChildren($request, null);
        return response()->json(['message' => 'Payload received']);
    }


    private function createCategoryWithChildren($data, $parent = null)
    {
        // Check if it's a spreadsheet and has sheets
        if ($data['type'] == 'spreadsheet' && !empty($data['sheets'])) {
            foreach ($data['sheets'] as $sheet) {
                foreach ($sheet['data'] as $row) {
                    // Create an entry for each row of spreadsheet data
                    $category = Directory::create([
                        'name' => $row['C'] ?? $data['name'],        // Use 'C' if available, otherwise use $data['name']
                        'type' => $data['type'],
                        'photo' => $row['B'] ?? null,                // Use 'B' if available, otherwise use null
                        'occupation' => $row['D'] ?? null,           // Use 'D' if available, otherwise use null
                        'email' => $row['E'] ?? null,                // Use 'E' if available, otherwise use null
                        'phone' => $row['F'] ?? null,                // Use 'F' if available, otherwise use null
                        'address' => $row['G'] ?? null,              // Use 'G' if available, otherwise use null
                        'facebook' => $row['I'] ?? null,             // Use 'I' if available, otherwise use null
                        'instagram' => $row['J'] ?? null,            // Use 'J' if available, otherwise use null
                        'twitter' => $row['K'] ?? null               // Use 'K' if available, otherwise use null
                    ]);
                    

                    if ($parent) {
                        $category->appendToNode($parent)->save();
                    }
                }
            }
        } else {
            // Create the directory entry for non-spreadsheet types
            $category = Directory::create([
                'name' => $data['name'],
                'type' => $data['type']
            ]);

            if ($parent) {
                $category->appendToNode($parent)->save();
            }

            // Recursively handle children
            if (!empty($data['children'])) {
                foreach ($data['children'] as $childData) {
                    $this->createCategoryWithChildren($childData, $category);
                }
            }
        }
    }


    // private function createCategoryWithChildren($data, $parent)
    // {
     
    //     $category = Directory::create([
    //             'name' => $data['name'],
    //             'type' => $data['type']
    //         ]);

    //     if ($parent) {
    //         $category->appendToNode($parent)->save();
    //     }

    //     if (!empty($data['children'])) {
    //         foreach ($data['children'] as $childData) {
    //             $this->createCategoryWithChildren($childData, $category);
    //         }
    //     }
    // }

    // New method to display the directory structure
    public function displayDirectoryStructure()
    {
        $rootDirectories = Directory::whereIsRoot()->get();
        echo $structure = $this->buildDirectoryStructure($rootDirectories);
        
       //return response()->json(['directory_structure' => $structure]);
    }

    private function buildDirectoryStructure($directories, $level = 0)
    {
        $result = '';

        foreach ($directories as $directory) {
            $indent = str_repeat('|__', $level * 4); // 4 spaces per level
            $result .= $indent . $directory->name . "(  $directory->type )<br />";
            
            if ($directory->children()->count() > 0) {
                $result .= $this->buildDirectoryStructure($directory->children, $level + 1);
            }
        }

        return $result;
    }

    public function ordering(Directory $directory, Request $request)
    {
        // reference https://github.com/lazychaser/laravel-nestedset
        switch($request->input('direction')){
            case 'up':
                $directory->up(); // directory ordering up
                break;
            case 'down':
                $directory->down(); //  // directory ordering down
            break;
        }
        
    }

    public function show(Directory $directory)
    {

       //\Log::info($directory);

        return response()->json([
                    'staff' => $directory,
                ]);
    }

    public function create(Request $request, $parentId)
    {

        //$parentId = 1;
        //\Log::info($parentId);
        
        /*
        * Incoming $request will be for folder and spreadsheet
        * Filter them based on given type
        */

        $type = $request->input('type');

        if (!$type) {
            \Log::warning('Missing "type" in request: ', $request->all());
        } else {
            switch($type) {
                case 'spreadsheet':
                    //\Log::info('staff');
                        $validatedData = $request->validate([
                                            'photo' => 'required|string|max:255',
                                            'name' => 'required|string|max:255',
                                            'occupation' => 'required|string|max:255',
                                            'phone' => 'nullable|string|max:255',
                                            'email' => 'nullable|email|max:255',
                                            'address' => 'required|string',
                                            'facebook' => 'nullable|string',
                                            'instagram' => 'nullable|string',
                                            'twitter' => 'nullable|string',
                                            'type' => 'nullable|string',
                                            // Add other fields you need to update
                                        ]);
                    break;

                case 'folder':
                    //\Log::info('department');
                        $validatedData = $request->validate([
                                            'name' => 'required|string|max:255',
                                            'type' => 'nullable|string',
                                        ]);
                    break;

                default:
                    \Log::warning('Unknown type received: ' . $type);
                    break;
            }
        }
        
      

         

   

        if($parentId == 0 ){
            // means at root
            $record = Directory::create([
                'name' => $request->input('name'),
                'type' => $request->input('type'),
            ]);

        } else {
            // Find the parent record
            $parent = Directory::find($parentId);
            if (!$parent) {
                return response()->json(['error' => 'Parent not found.']);
            }

            // Create a new record as a child of the parent record
            $record = $parent->children()->create($validatedData);
        }
        

        return response()->json(['success' => 'Record created successfully.', 'record' => $record], 201);
    }

    public function update(Request $request, Directory $directory)
    {

        //\Log::info($request);

         // Validate the incoming request
        $validatedData = $request->validate([
            'photo' => 'required|string|max:255',
            'name' => 'required|string|max:255',
            'occupation' => 'required|string|max:255',
            'phone' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'address' => 'required|string',
            'facebook' => 'nullable|string',
            'instagram' => 'nullable|string',
            'twitter' => 'nullable|string',
            // Add other fields you need to update
        ]);

        //\Log::info($request->all());

        // Update the directory with the validated data
        $directory->update($validatedData);

        return response()->json([
                    'message' => 'Successfully updated',
                ]);
    }

    public function delete(Request $request, Directory $directory)
    {

        //\Log::info($request);

         // Validate the incoming request
        $validatedData = $request->validate([
            'acknowledge' => 'required',
            
        ]);

        //\Log::info($request->all());

        // Update the directory with the validated data
        $directory->delete();

        return response()->json([
                    'message' => 'Successfully deleted',
                ]);
    }



}
