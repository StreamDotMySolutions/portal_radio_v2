<?php
namespace App\Services;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;


class CommonService
{

    public static function handleStoreFile($request, $directory)
    {
        // Get the uploaded file
        $filename = $request->getClientOriginalName();
        $extension = $request->getClientOriginalExtension();
        $filenameWithoutExtension = pathinfo($filename, PATHINFO_FILENAME);
        
        // poster name to be saved in DB
        $storedFileName =  time() . '-' . Str::slug($filenameWithoutExtension) . '.' . $extension;
        
        // Store the image inside the public disk
        if ( Storage::disk('public')->putFileAs($directory, $request, $storedFileName) ){
            //\Log::info('GlobalService - File stored ' . $storedFileName);
            return $storedFileName;
        } else {
            \Log::info('GlobalService - problem storing file, check folder permission');
            return null;
        }
    }

    public static function handleDeleteFile($filename, $directory)
    {
        // delete the file on disk
        return Storage::disk('public')->delete("{$directory}/{$filename}");
    }
}