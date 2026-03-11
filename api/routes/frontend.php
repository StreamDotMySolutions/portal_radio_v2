<?php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Frontend\{
    MenuController,
    ArticleController,
    ArticleGalleryController,
    BannerController,
    ProgrammeController,
    VideoController,
    FooterController,
    DirectoryController,
    AnalyticsController,
    DownloadController,
    ComplaintController,
    StationController,
    SettingController,
    ChatController,
};

// prefix frontend/...
Route::get('/articles/{article}', [ArticleController::class, 'index']);
Route::get('/listings/{article}', [ArticleController::class, 'listings']);
Route::get('/show/{article}', [ArticleController::class, 'show']);
Route::get('/article-galleries/{articleDataId}', [ArticleGalleryController::class, 'index']);

Route::get('/home-footer', [FooterController::class, 'index']);

Route::get('/home-menu', [MenuController::class, 'index']);
Route::get('/home-menu-1', [MenuController::class, 'menu1']);
Route::get('/home-menu-2', [MenuController::class, 'menu2']);
Route::get('/sitemap', [MenuController::class, 'sitemap']);
Route::get('/sitemap/search', [MenuController::class, 'sitemapSearch']);

Route::get('/home-banners', [BannerController::class, 'index']);
Route::get('/home-programmes', [ProgrammeController::class, 'index']);
Route::get('/home-videos', [VideoController::class, 'index']);
Route::get('/stations', [StationController::class, 'index']);
Route::get('/stations/{station:slug}', [StationController::class, 'show']);
Route::get('/livestream-url', [SettingController::class, 'livestreamUrl']);
Route::post('/directories/search', [DirectoryController::class, 'search']);
Route::get('/directories/{id}', [DirectoryController::class, 'index']);
Route::get('/directories/{directory}/show', [DirectoryController::class, 'show']);

// Tracked downloads
Route::get('/download/asset/{filename}', [DownloadController::class, 'asset'])->where('filename', '.*');
Route::get('/download/article-pdf/{filename}', [DownloadController::class, 'articlePdf'])->where('filename', '.*');

// Analytics tracking (fire-and-forget, no auth)
Route::post('/track', [AnalyticsController::class, 'store']);
Route::get('/station-hits', [AnalyticsController::class, 'stationHits']);
Route::get('/livestream-hits', [AnalyticsController::class, 'livestreamHits']);

// Complaints submission (public, protected by reCAPTCHA)
Route::post('/complaints', [ComplaintController::class, 'store']);

// Chat
Route::prefix('chat')->group(function () {
    Route::post('/register', [ChatController::class, 'register']);
    Route::post('/login', [ChatController::class, 'login']);
    Route::post('/forgot-password', [ChatController::class, 'forgotPassword']);
    Route::post('/reset-password', [ChatController::class, 'resetPassword']);
    Route::get('/messages', [ChatController::class, 'index']);
    Route::post('/messages', [ChatController::class, 'store'])->middleware('throttle:chat-send');
    Route::post('/send-activation', [ChatController::class, 'sendActivation'])->middleware('throttle:3,5');
    Route::get('/verify-email/{id}/{hash}', [ChatController::class, 'verifyEmail'])->name('chat.verify-email');
    Route::get('/profile', [ChatController::class, 'profile']);
    Route::post('/profile', [ChatController::class, 'updateProfile']);
    Route::delete('/profile/avatar', [ChatController::class, 'removeAvatar']);
    Route::get('/profile/{userId}', [ChatController::class, 'publicProfile']);
});

