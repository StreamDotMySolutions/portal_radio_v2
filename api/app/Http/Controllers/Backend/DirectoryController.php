<?php

namespace App\Http\Controllers\Backend;

use Illuminate\Http\Request;


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
        $category = Category::create(['name' => $data['name']]);

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
