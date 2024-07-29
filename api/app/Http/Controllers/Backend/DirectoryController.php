<?php

namespace App\Http\Controllers\Backend;

use Illuminate\Http\Request;
use App\Models\Directory;

class DirectoryController extends Controller
{
    public function index($id = null)
    {
        //\Log::info($id);
        $ancestors = [];
        $title = null;
        $perPage = 20;

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

    public function store(Request $request, $root)
    {
       
        // Find the node with the given root name
        $node = Directory::where('name', $root)->first();

        // If the node exists, delete it and all its descendants
        if ($node) {
            $node->delete();
        }

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

    public function update(Request $request, Directory $directory)
    {

        //\Log::info($request);

         // Validate the incoming request
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'occupation' => 'required|string|max:255',
            'phone' => 'nullable|string|max:255',
            'email' => 'required|email|max:255',
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
