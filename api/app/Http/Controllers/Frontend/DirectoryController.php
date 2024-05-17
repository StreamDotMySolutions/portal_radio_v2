<?php

namespace App\Http\Controllers\Frontend;

use Illuminate\Http\Request;
use App\Models\Directory;


class DirectoryController extends Controller
{
    public function index($id = null)
    {

        //\Log::info($id);
        $ancestors = [];
        $title = null;

        if($id == null){
            $items = Directory::query()
                        ->whereIsRoot()
                        ->defaultOrder()
                        ->paginate(6);
        } else {
            $ancestors = Directory::query()
                                    //->select(['name','id'])
                                    ->where('id', $id)
                                    ->with(['ancestors'])
                                    ->first();

            $items = Directory::query()
                        ->where('parent_id', $id)
                        ->defaultOrder()
                        ->paginate(50);

            $departments = Directory::query()
                        ->where('parent_id', $id)
                        ->where('type', 'folder')
                        ->defaultOrder()
                        ->paginate(50);

            $staffs = Directory::query()
                        ->where('parent_id', $id)
                        ->where('type', 'spreadsheet')
                        ->defaultOrder()
                        ->paginate(50);

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
