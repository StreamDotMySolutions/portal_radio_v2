<?php

namespace App\Http\Controllers\Backend;

use App\Http\Requests\ArticlePdf\StoreRequest;
use App\Models\ArticleData;
use App\Models\ArticlePdf;
use App\Services\ArticlePdfService;

class ArticlePdfController extends Controller
{
    public function show(ArticleData $articleData)
    {
        return response()->json(['article_pdf' => $articleData->articlePdf]);
    }

    public function store(StoreRequest $request)
    {
        ArticlePdfService::store($request);
        return response()->json(['message' => 'Article PDF successfully saved']);
    }

    public function delete(ArticlePdf $articlePdf)
    {
        ArticlePdfService::delete($articlePdf);
        return response()->json(['message' => 'Article PDF successfully deleted']);
    }
}
