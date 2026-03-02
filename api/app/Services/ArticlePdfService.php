<?php

namespace App\Services;

use App\Models\ArticleData;
use App\Models\ArticlePdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ArticlePdfService
{
    public static function store(Request $request)
    {
        if ($request->has('article_pdf')) {

            $articleData = ArticleData::find($request->input('article_data_id'));

            // Replace existing PDF if one already exists
            if ($articleData->articlePdf) {
                self::handleDeleteFile($articleData->articlePdf->filename, 'article_pdf');
                $articleData->articlePdf->delete();
            }

            $file = $request->file('article_pdf');

            $articlePdf = new ArticlePdf([
                'user_id'         => auth('sanctum')->user()->id,
                'article_data_id' => $request->input('article_data_id'),
                'filename'        => self::handleStoreFile($file, 'article_pdf'),
                'filesize'        => $file->getSize(),
            ]);

            return $articlePdf->save();
        }
    }

    public static function delete(ArticlePdf $articlePdf)
    {
        self::handleDeleteFile($articlePdf->filename, 'article_pdf');
        $articlePdf->delete();
    }

    public static function handleStoreFile($file, $directory)
    {
        $filename = $file->getClientOriginalName();
        $extension = $file->getClientOriginalExtension();
        $filenameWithoutExtension = pathinfo($filename, PATHINFO_FILENAME);

        $storedFileName = time() . '-' . Str::slug($filenameWithoutExtension) . '.' . $extension;

        if (Storage::disk('public')->putFileAs($directory, $file, $storedFileName)) {
            return $storedFileName;
        } else {
            \Log::info('ArticlePdfService - problem storing file, check folder permission');
            return null;
        }
    }

    public static function handleDeleteFile($filename, $directory)
    {
        Storage::disk('public')->delete("{$directory}/{$filename}");
    }
}
