<?php
namespace App\Services;

use App\Models\ArticleGallery;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ArticleGalleryService
{

    public static function index($article)
    {
        $paginate = ArticleGallery::query()->where('article_id', $article->id);
        return $paginate->paginate(10000)->withQueryString();  
    }

    public static function store(Request $request)
    {        
        //\Log::info($request);
        if($request->has('article_gallery')){
            //\Log::info('asset created');
            $articleGallery = new \App\Models\ArticleGallery([
                'user_id' =>  auth('sanctum')->user()->id,
                'article_id' => $request->input('article_id'),
                'filename' => self::handleStoreFile($request->file('article_gallery'), $directory = 'article_galleries'),
            ]);

            return $articleGallery->save(); 
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

    public static function delete($articleAsset)
    {
        self::handleDeleteFile($articleAsset->filename,'article_galleries');
        return $articleAsset->delete();
    }
}
