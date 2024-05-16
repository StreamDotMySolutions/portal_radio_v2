<?php

namespace App\Http\Controllers\Backend;

use Illuminate\Http\Request;
use App\Models\Directory;

class DirectoryController extends Controller
{
    public function store(Request $request)
    {
        \Log::info($request);
        Directory::truncate();
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
                        'name' => $row['A'] ?? $data['name'],        // Use the 'A' field for name
                        'type' => $data['type'],
                        'occupation' => $row['B'],  // Use the 'B' field for occupation
                        'email' => $row['C']        // Use the 'C' field for email
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
            $result .= $indent . $directory->name . "<br />";
            
            if ($directory->children()->count() > 0) {
                $result .= $this->buildDirectoryStructure($directory->children, $level + 1);
            }
        }

        return $result;
    }

}
