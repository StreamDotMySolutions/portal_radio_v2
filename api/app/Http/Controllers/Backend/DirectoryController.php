<?php

namespace App\Http\Controllers\Backend;

use Illuminate\Http\Request;
use App\Models\Directory;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;

class DirectoryController extends Controller
{
    public function index(Request $request, $parentId)
    {
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query = Directory::query()->where('name', 'like', "%{$search}%");
        } elseif (!is_null($parentId) && $parentId != 0) {
            $query = Directory::query()->where('parent_id', $parentId);
        } else {
            $query = Directory::query()->whereIsRoot();
        }

        $sortBy  = $request->input('sort_by');
        $sortDir = $request->input('sort_dir', 'desc');

        if ($sortBy === 'date') {
            $query->orderBy('created_at', $sortDir);
        } elseif ($sortBy === 'name') {
            $query->orderBy('name', $sortDir);
        } else {
            $query->defaultOrder();
        }

        $allowed = [10, 25, 50, 100];
        $perPage = (int) $request->input('per_page', 25);
        if (!in_array($perPage, $allowed)) {
            $perPage = 25;
        }

        $departmentsCount = (clone $query)->where('type', 'folder')->count();
        $staffsCount      = (clone $query)->where('type', '!=', 'folder')->count();

        if ($request->filled('search')) {
            $directories = $query->with(['ancestors' => fn($q) => $q->defaultOrder(), 'descendants'])->paginate($perPage)->withQueryString();
        } else {
            $directories = $query->with(['descendants'])->paginate($perPage)->withQueryString();
        }

        return response()->json([
            'directories'       => $directories,
            'departments_count' => $departmentsCount,
            'staffs_count'      => $staffsCount,
        ]);
    }

    public function show(Directory $directory)
    {
        $directory->load(['ancestors' => fn($q) => $q->defaultOrder()]);
        return response()->json(['directory' => $directory]);
    }

    public function storeRecord(Request $request)
    {
        $type = $request->input('type');

        if ($type === 'folder') {
            $request->validate(['name' => 'required|string|max:255']);
            $record = Directory::create([
                'name' => $request->input('name'),
                'type' => 'folder',
            ]);
        } else {
            $request->validate([
                'name'       => 'required|string|max:255',
                'occupation' => 'nullable|string|max:255',
                'phone'      => 'nullable|string|max:255',
                'email'      => 'nullable|email|max:255',
                'address'    => 'nullable|string',
                'facebook'   => 'nullable|string',
                'instagram'  => 'nullable|string',
                'twitter'    => 'nullable|string',
                'photo'      => 'nullable|string|max:255',
            ]);
            $record = Directory::create([
                'name'       => $request->input('name'),
                'type'       => 'spreadsheet',
                'photo'      => $request->input('photo'),
                'occupation' => $request->input('occupation'),
                'email'      => $request->input('email'),
                'phone'      => $request->input('phone'),
                'address'    => $request->input('address'),
                'facebook'   => $request->input('facebook'),
                'instagram'  => $request->input('instagram'),
                'twitter'    => $request->input('twitter'),
            ]);
        }

        $parentId = $request->input('parent_id');
        if ($parentId && $parentId != 0) {
            $parent = Directory::find($parentId);
            if ($parent) {
                $parent->appendNode($record);
            }
        }

        return response()->json(['message' => 'Directory created successfully.']);
    }

    public function update(Request $request, Directory $directory)
    {
        if ($directory->type === 'folder') {
            $validatedData = $request->validate([
                'name' => 'required|string|max:255',
                'parent_id' => 'nullable|integer|exists:directories,id',
            ]);
        } else {
            $validatedData = $request->validate([
                'name'       => 'required|string|max:255',
                'occupation' => 'nullable|string|max:255',
                'phone'      => 'nullable|string|max:255',
                'email'      => 'nullable|email|max:255',
                'address'    => 'nullable|string',
                'facebook'   => 'nullable|string',
                'instagram'  => 'nullable|string',
                'twitter'    => 'nullable|string',
                'photo'      => 'nullable|string|max:255',
                'parent_id'  => 'nullable|integer|exists:directories,id',
            ]);
        }

        $directory->update($validatedData);

        return response()->json(['message' => 'Directory updated successfully.']);
    }

    public function delete(Request $request, Directory $directory)
    {
        $directory->delete();
        return response()->json(['message' => 'Directory deleted successfully.']);
    }

    public function ordering(Directory $directory, Request $request)
    {
        switch ($request->input('direction')) {
            case 'up':
                $directory->up();
                break;
            case 'down':
                $directory->down();
                break;
        }
    }

    public function tree()
    {
        // Only show folders as potential parents, not staff entries
        $tree = Cache::remember('backend.directory.tree', 86400, function () {
            $roots = Directory::whereIsRoot()->where('type', 'folder')->defaultOrder()->with(['children'])->get();
            return $roots->map(fn($root) => $this->buildTreeNode($root))->toArray();
        });
        return response()->json(['tree' => $tree]);
    }

    private function buildTreeNode(Directory $directory): array
    {
        // Only include folder children
        $folderChildren = $directory->children->filter(fn($child) => $child->type === 'folder');

        return [
            'id' => $directory->id,
            'name' => $directory->name,
            'type' => $directory->type,
            'children' => $folderChildren->map(fn($child) => $this->buildTreeNode($child))->toArray(),
        ];
    }

    // Bulk import from Google Apps Script
    public function store(Request $request, $root)
    {
        $node = Directory::where('name', $root)->first();
        if ($node) {
            $node->delete();
        }
        $this->createCategoryWithChildren($request, null);
        return response()->json(['message' => 'Payload received']);
    }

    private function createCategoryWithChildren($data, $parent = null)
    {
        if ($data['type'] == 'spreadsheet' && !empty($data['sheets'])) {
            foreach ($data['sheets'] as $sheet) {
                foreach ($sheet['data'] as $row) {
                    $category = Directory::create([
                        'name'       => $row['C'] ?? $data['name'],
                        'type'       => $data['type'],
                        'photo'      => $row['B'] ?? null,
                        'occupation' => $row['D'] ?? null,
                        'email'      => $row['E'] ?? null,
                        'phone'      => $row['F'] ?? null,
                        'address'    => $row['G'] ?? null,
                        'facebook'   => $row['I'] ?? null,
                        'instagram'  => $row['J'] ?? null,
                        'twitter'    => $row['K'] ?? null,
                    ]);
                    if ($parent) {
                        $category->appendToNode($parent)->save();
                    }
                }
            }
        } else {
            $category = Directory::create([
                'name' => $data['name'],
                'type' => $data['type'],
            ]);
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
}
