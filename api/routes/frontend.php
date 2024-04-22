<?php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Frontend\{
    ArticleController,
    BannerController,
    ProgrammeController,
    VideoController,
    FooterController,
};

Route::get('/articles/{article}', [ArticleController::class, 'index']);
Route::get('/home-banners', [BannerController::class, 'index']);
Route::get('/home-programmes', [ProgrammeController::class, 'index']);
Route::get('/home-videos', [VideoController::class, 'index']);
Route::get('/home-footer', [FooterController::class, 'index']);