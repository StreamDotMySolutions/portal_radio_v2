<?php
namespace App\Services;

use App\Models\ArticlePoster;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ArticlePosterService
{
    public static function store(Request $request)
    {        
        if($request->has('article_poster')){

            // delete previous image
            $article = \App\Models\Article::find( $request->input('article_id') );
            if($article->articlePoster){
                //\Log::info('deleting prev poster');
                self::handleDeleteFile($article->articlePoster->filename,'article_poster');
                $article->articlePoster->delete();
            }
            
            // Create a new PageImage instance and fill it with request data
            $articlePoster = new \App\Models\ArticlePoster([
                'user_id' =>  auth('sanctum')->user()->id,
                'article_id' => $request->input('article_id'),
                'filename' => self::handleStoreFile($request->file('article_poster'), $directory = 'article_poster'),
            ]);

            // Save the PageImage instance to the database
            return $articlePoster->save(); 
        }
    }

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
        Storage::disk('public')->delete("{$directory}/{$filename}");
    }

    public static function update(Request $request, $article)
    {
        
    }

    public static function show($article)
    {
 
    }

    public static function delete($article)
    {
      
    }
}
