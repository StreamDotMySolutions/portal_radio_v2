<?php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Frontend\{
    MenuController,
    ArticleController,
    BannerController,
    ProgrammeController,
    VideoController,
    FooterController,
};

Route::get('/articles/{article}', [ArticleController::class, 'index']);
Route::get('/show/{article}', [ArticleController::class, 'show']);
Route::get('/home-footer', [FooterController::class, 'index']);
Route::get('/home-menu', [MenuController::class, 'index']);
Route::get('/home-banners', [BannerController::class, 'index']);
Route::get('/home-programmes', [ProgrammeController::class, 'index']);
Route::get('/home-videos', [VideoController::class, 'index']);
