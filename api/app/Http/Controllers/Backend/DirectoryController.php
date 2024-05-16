<?php

namespace App\Http\Controllers\Backend;

use Illuminate\Http\Request;
use App\Models\Directory;

class DirectoryController extends Controller
{
    public function store(Request $request)
    {
        \Log::info($request);
        $this->createCategoryWithChildren($request, null);
        return response()->json(['message' => 'Payload received']);
    }

    private function createCategoryWithChildren($data, $parent)
    {
        $category = Directory::create(['name' => $data['name']]);

        if ($parent) {
            $category->appendToNode($parent)->save();
        }

        if (!empty($data['children'])) {
            foreach ($data['children'] as $childData) {
                $this->createCategoryWithChildren($childData, $category);
            }
        }
    }

}
