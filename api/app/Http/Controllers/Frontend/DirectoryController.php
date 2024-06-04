<?php

namespace App\Http\Controllers\Frontend;

use Illuminate\Http\Request;
use App\Models\Directory;
use Illuminate\Support\Facades\DB;


class DirectoryController extends Controller
{
    public function index($id = null)
    {

        //\Log::info($id);
        $ancestors = [];
        $departments = [];
        $title = null;
        $staffs=[];

        // Get the current page and pagination limit
        $currentPage = request()->get('page', 1);
        $perPage = 50;

        // Calculate the starting number for the current page
        $startNumber = ($currentPage - 1) * $perPage + 1;

        if($id == 'null'){
            //\Log::info('is null');
            $items = Directory::query()
                        ->whereIsRoot()
                        ->defaultOrder()
                        ->paginate(6);
            //\Log::info($items);
        } else {
            $ancestors = Directory::query()
                            ->where('id', $id)
                            ->with(['ancestors'])
                            ->first();

            // Map the results to add a virtual number column and remove the prefix from the name
            $ancestors->each(function ($ancestor) {
                if ($ancestor->ancestors) {
                    $ancestor->ancestors->transform(function ($item) {
                        // Remove the prefix before the double underscore
                        if (strpos($item->name, '__') !== false) {
                            $item->name = substr($item->name, strpos($item->name, '__') + 2);
                        }
                        return $item;
                    });
                }
            });
                                  

            $items = Directory::query()
                        ->where('parent_id', $id)
                        ->defaultOrder()
                        ->paginate(50);

            $departments = Directory::query()
                        // ->select(
                        //     '*',  // Select all columns
                        //     DB::raw('SUBSTRING(name, LOCATE("__", name) + 2) as name_without_prefix')
                        // )
                        ->where('parent_id', $id)
                        ->where('type', 'folder')
                        //->defaultOrder()
                        //->orderBy('name', 'ASC')
                        ->orderBy(DB::raw('CAST(SUBSTRING_INDEX(name, "_", 1) AS UNSIGNED)'), 'asc')
                        ->paginate($perPage);

            // Map the results to add a virtual number column and remove the prefix from the name
            $departments->getCollection()->transform(function ($item, $index) use ($startNumber) {
                // Remove the prefix before the double underscore
                $item->name = substr($item->name, strpos($item->name, '__') + 2);
                
                // Add a virtual number column
                $item->number = $startNumber + $index;
                
                return $item;
            });


            $staffs = Directory::query()
                        ->where('parent_id', $id)
                        ->where('type', 'spreadsheet')
                        ->defaultOrder()
                        ->paginate(50);

            // Map the results to add a virtual number column
            $staffs->getCollection()->transform(function ($item, $index) use ($startNumber) {
                $item->number = $startNumber + $index;
                return $item;
            });

            $title = Directory::where('id',$id)->select(['name'])->first();
        }
  
        
        return response()->json([
            
                'title' => $title,
                'ancestors' => $ancestors,
                'items' => $items,
                'departments' => $departments,
                'staffs' => $staffs
            
            ]);
    }

    public function show(Directory $directory){

        $title = Directory::where('id',$directory->id)->select(['name'])->first();

        $ancestors = Directory::query()
                //->select(['name','id'])
                ->where('id', $directory->id)
                ->with(['ancestors'])
                ->first();

        return response()->json([
                    'title' => $title,
                    'ancestors' => $ancestors,
                    'staff' => $directory,
                ]);
    }
}
