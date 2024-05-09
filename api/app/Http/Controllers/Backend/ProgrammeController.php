<?php

namespace App\Http\Controllers\Backend;

use Illuminate\Http\Request;
use App\Models\Programme;
use App\Services\CommonService;

class ProgrammeController extends Controller
{

    public function index(){

        $programmes = Programme::defaultOrder()->paginate(10)->withQueryString(); 
        return response()->json(['programmes' => $programmes]);
    }

    public function show(Programme $programme){
        return response()->json(['programme' => $programme]);
    }

    public function store(Request $request){
        // validation
        $request->validate([
            'title' => 'required',
            'redirect_url' => 'required|url',
            'programme' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048'

        ]);

        if($request->has('programme')){
            //\Log::info($request);
            $programme = Programme::create([
                'user_id' =>  auth('sanctum')->user()->id,
                'title' => $request->input('title'),
                'redirect_url' => $request->input('redirect_url'),
                'filename' => CommonService::handleStoreFile($request->file('programme'), $directory = 'programmes'),
            ]);

            if (!$programme) {
                return response()->json(['message' => 'Programme creation failed'], 500);
            }
        
            return response()->json(['message' => 'Programme creation success']);
        }
    }

    public function update(Request $request,Programme $programme)
    {
        // validation
        $data = $request->validate([
            'title' => 'sometimes',
            'redirect_url' => 'sometimes|url',
        ]);

        $programme = Programme::where('id', $programme->id)->update($request->except(['_method','id']));

        // Check if the update was successful
        if ($programme) {
            return response()->json(['message' => 'Programme successfully created']);
        } else {
            return response()->json(['message' => 'Programme update failed'], 500);
        }
    }

    public function delete(Request $request,Programme $programme){

        $data = $request->validate([
            'acknowledge' => 'required',
        ]);

        //\Log::info($programme);
        CommonService::handleDeleteFile($programme->filename, $directory = 'programmes');

        if ( $programme->delete() ) {
            return response()->json(['message' => 'Programme successfully deleted']);
        } else {
            return response()->json(['message' => 'Programme delete failed'], 500);
        }
        
    }

    public function ordering(Programme $programme, Request $request)
    {
        //\Log::info($request);
        // reference https://github.com/lazychaser/laravel-nestedset
        switch($request->input('direction')){
            case 'up':
                $programme->up(); // programme ordering up
                return response()->json(['message' => 'Programme Up']);
                //\Log::info('up executed');
                break;
            case 'down':
                $programme->down(); //  // programme ordering down
                return response()->json(['message' => 'Programme Down']);
            break;
        }
        
    }

}