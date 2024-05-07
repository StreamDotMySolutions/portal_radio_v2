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
Route::get('/home-menu-1', [MenuController::class, 'menu1']);
Route::get('/home-menu-2', [MenuController::class, 'menu2']);
Route::get('/home-banners', [BannerController::class, 'index']);
Route::get('/home-programmes', [ProgrammeController::class, 'index']);
Route::get('/home-videos', [VideoController::class, 'index']);
