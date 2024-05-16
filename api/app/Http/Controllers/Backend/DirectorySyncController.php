<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Directory;

class DirectorySyncController extends Controller
{
    public function sync(Request $request)
    {
        $data = $request->input();

        // Validate the incoming data
        $request->validate([
            '*.name' => 'required|string',
            '*.type' => 'required|string|in:folder,spreadsheet',
            '*.children' => 'array'
        ]);

        // Clear existing directories (optional, depends on your use case)
        Directory::truncate();

        // Process the nested data
        $this->createNestedItems($data, null);

        return response()->json(['message' => 'Data synced successfully'], 200);
    }

    private function createNestedItems($items, $parent)
    {
        foreach ($items as $item) {
            $directory = new Directory([
                'name' => $item['name'],
                'type' => $item['type']
            ]);

            if ($parent) {
                $parent->appendNode($directory);
            } else {
                $directory->saveAsRoot();
            }

            if (!empty($item['children'])) {
                $this->createNestedItems($item['children'], $directory);
            }
        }
    }
}
