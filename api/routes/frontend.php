<?php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Frontend\{
    ArticleController,
};

Route::get('/articles/{article}', [ArticleController::class, 'index']);