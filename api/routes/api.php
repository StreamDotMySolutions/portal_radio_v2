<?php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\GithubWebhookController;
use App\Http\Controllers\Backend\{
    RoleController,
    UserController,
    ChatUserController,
    ChatMessageController,
    AuthController,
    AccountController,
    DashboardController,
    ArticleController,
    ArticlePosterController,
    ArticleContentController,
    ArticleAssetController,
    ArticleGalleryController,
    ArticlePdfController,
    ArticleDataController,
    ArticleSettingController,
    BannerController,
    ProgrammeController,
    VideoController,
    AssetController,
    DirectoryController,
    DirectorySyncController,
    VodController,
    AnalyticsController,
    ActivityController,
    ComplaintController,
    StationController,
    StationCategoryController,
    LivestreamController,
    SettingController,
};

Route::get('/', function () {
    return 'Backend API Server';
});

Auth::routes();

// Auth
Route::group(['middleware' => ['guest']], function () {
    // Auth-related routes
    Route::post('/register', [AuthController::class, 'register'])->name('register');
    Route::post('/login', [AuthController::class, 'login'])->name('login');
    Route::post('/password/email', [AuthController::class, 'email']);
    Route::post('/password/reset', [AuthController::class, 'resetPassword']);
    Route::get('/user-departments', [UserDepartmentController::class, 'index']);
});

// Signed 
Route::group(['middleware' => ['auth:sanctum']], function () {
    Route::get('/account', [AccountController::class, 'show']);
    Route::put('/account', [AccountController::class, 'update']);
    Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum')->name('logout');
});

// Manage Users
Route::group(['middleware' => ['auth:sanctum','role:admin']], function () {
    Route::get('/users', [UserController::class, 'index']);
    Route::get('/users/roles', [UserController::class, 'roles']);
    Route::post('/users', [UserController::class, 'store']);
    Route::get('/users/{user}', [UserController::class, 'show']);
    Route::put('/users/{user}', [UserController::class, 'update']);
    Route::delete('/users/{user}', [UserController::class, 'delete']);
});

// Manage Roles
Route::group(['middleware' => ['auth:sanctum','role:admin']], function () {
    Route::get('/roles', [RoleController::class, 'index']);
    Route::post('/roles', [RoleController::class, 'store']);
    Route::get('/roles/{role}', [RoleController::class, 'show']);
    Route::put('/roles/{role}', [RoleController::class, 'update']);
    Route::delete('/roles/{role}', [RoleController::class, 'delete']);
});

// Manage Articles
Route::group(['middleware' => ['auth:sanctum','role:admin']], function () {
    Route::get('/articles/tree', [ArticleController::class, 'tree']);
    Route::get('/articles/search', [ArticleController::class, 'search']);
    Route::get('/articles/node/{parentId}', [ArticleController::class, 'index']);
    Route::post('/articles', [ArticleController::class, 'store']);
    Route::get('/articles/{article}', [ArticleController::class, 'show']);
    Route::put('/articles/{article}', [ArticleController::class, 'update']);
    Route::delete('/articles/{article}', [ArticleController::class, 'delete']);

    // ordering
    Route::get('/articles/ordering/{article}', [ArticleController::class, 'ordering']);

    // ArticleData
    //Route::get('/articles-data/node/{parentId}', [ArticleController::class, 'articlesData']);

    // ArticlePoster
    Route::post('/articlePosters', [ArticlePosterController::class, 'store']);

    // ArticleContent
    Route::get('/article-contents/{articleContent}', [ArticleContentController::class, 'show']);
    Route::post('/article-contents', [ArticleContentController::class, 'store']);
    Route::put('/article-contents/{articleContent}', [ArticleContentController::class, 'update']);
    Route::delete('/article-contents/{articleContent}', [ArticleContentController::class, 'delete']);

    // ArticleAsset
    Route::get('/article-assets/{article}', [ArticleAssetController::class, 'index']);
    Route::post('/article-assets', [ArticleAssetController::class, 'store']);
    Route::delete('/article-assets/{articleAsset}', [ArticleAssetController::class, 'delete']);

    
    // ArticleGallery
    Route::get('/article-galleries/{articleGallery}', [ArticleGalleryController::class, 'index']);
    Route::post('/article-galleries', [ArticleGalleryController::class, 'store']);
    Route::delete('/article-galleries/{articleGallery}', [ArticleGalleryController::class, 'delete']);

    // ArticlePdf
    Route::get('/article-pdf/{articleData}', [ArticlePdfController::class, 'show']);
    Route::post('/article-pdf', [ArticlePdfController::class, 'store']);
    Route::delete('/article-pdf/{articlePdf}', [ArticlePdfController::class, 'delete']);

    // ArticleAsset
    // Route::get('/article-assets/{article}', [ArticleAssetController::class, 'index']);
    // Route::post('/article-assets', [ArticleAssetController::class, 'store']);
    // Route::delete('/article-assets/{articleAsset}', [ArticleAssetController::class, 'delete']);

    // ArticleData
    Route::get('/article-data/node/{parentId}', [ArticleDataController::class, 'index']);
    Route::get('/article-data/ordering/{articleData}', [ArticleDataController::class, 'ordering']);
    Route::post('/article-data', [ArticleDataController::class, 'store']);
    Route::get('/article-data/{articleData}', [ArticleDataController::class, 'show']);
    Route::put('/article-data/{articleData}', [ArticleDataController::class, 'update']);
    Route::delete('/article-data/{articleData}', [ArticleDataController::class, 'delete']);

    // Article Settings
    Route::get('/article-settings/{article}', [ArticleSettingController::class, 'show']);
    Route::put('/article-settings/{article}', [ArticleSettingController::class, 'update']);
    Route::patch('/article-settings/{article}/toggle', [ArticleSettingController::class, 'toggle']);

    
    // Banner Settings
    Route::get('/banners', [BannerController::class, 'index']);
    Route::get('/banners/{banner}', [BannerController::class, 'show']);
    Route::post('/banners', [BannerController::class, 'store']);
    Route::put('/banners/{banner}', [BannerController::class, 'update']);
    Route::delete('/banners/{banner}', [BannerController::class, 'delete']);
    Route::get('/banners/ordering/{banner}', [BannerController::class, 'ordering']);
    Route::patch('/banners/{banner}/toggle', [BannerController::class, 'toggle']);

    // Stations
    Route::get('/stations', [StationController::class, 'index']);
    Route::get('/stations/{station}', [StationController::class, 'show']);
    Route::post('/stations', [StationController::class, 'store']);
    Route::put('/stations/{station}', [StationController::class, 'update']);
    Route::delete('/stations/{station}', [StationController::class, 'delete']);
    Route::patch('/stations/{station}/toggle', [StationController::class, 'toggle']);
    Route::get('/stations/ordering/{station}', [StationController::class, 'ordering']);

    // Station Categories
    Route::get('/station-categories/all', [StationCategoryController::class, 'all']);
    Route::get('/station-categories', [StationCategoryController::class, 'index']);
    Route::post('/station-categories', [StationCategoryController::class, 'store']);
    Route::get('/station-categories/ordering/{stationCategory}', [StationCategoryController::class, 'ordering']);
    Route::get('/station-categories/{stationCategory}', [StationCategoryController::class, 'show']);
    Route::put('/station-categories/{stationCategory}', [StationCategoryController::class, 'update']);
    Route::delete('/station-categories/{stationCategory}', [StationCategoryController::class, 'delete']);
    Route::patch('/station-categories/{stationCategory}/toggle', [StationCategoryController::class, 'toggle']);

    // Settings
    Route::get('/settings', [SettingController::class, 'index']);
    Route::get('/settings/{key}', [SettingController::class, 'show']);
    Route::put('/settings/{key}', [SettingController::class, 'update']);

    // Livestream
    Route::get('/livestream', [LivestreamController::class, 'index']);

    // Programmes Settings
    Route::get('/programmes', [ProgrammeController::class, 'index']);
    Route::get('/programmes/{programme}', [ProgrammeController::class, 'show']);
    Route::post('/programmes', [ProgrammeController::class, 'store']);
    Route::put('/programmes/{programme}', [ProgrammeController::class, 'update']);
    Route::post('/programmes', [ProgrammeController::class, 'store']);
    Route::delete('/programmes/{programme}', [ProgrammeController::class, 'delete']);
    Route::get('/programmes/ordering/{programme}', [ProgrammeController::class, 'ordering']);

    // Videos Settings
    Route::get('/videos', [VideoController::class, 'index']);
    Route::get('/videos/{video}', [VideoController::class, 'show']);
    Route::post('/videos', [VideoController::class, 'store']);
    Route::put('/videos/{video}', [VideoController::class, 'update']);
    Route::post('/videos', [VideoController::class, 'store']);
    Route::delete('/videos/{video}', [VideoController::class, 'delete']);
    Route::get('/videos/ordering/{video}', [VideoController::class, 'ordering']);

    // Assets
    Route::get('/assets/tree', [AssetController::class, 'tree']);
    Route::get('/assets/node/{parentId}', [AssetController::class, 'index']);
    Route::get('/assets', [AssetController::class, 'index']);
    Route::get('/assets/{asset}', [AssetController::class, 'show']);
    Route::post('/assets', [AssetController::class, 'store']);
    Route::put('/assets/{asset}', [AssetController::class, 'update']);
    Route::post('/assets', [AssetController::class, 'store']);
    Route::delete('/assets/{asset}', [AssetController::class, 'delete']);
    Route::get('/assets/ordering/{asset}', [AssetController::class, 'ordering']);

    // Vods
    Route::get('/vods/tree', [VodController::class, 'tree']);
    Route::get('/vods/node/{parentId}', [VodController::class, 'index']);
    Route::get('/vods', [VodController::class, 'index']);
    Route::get('/vods/list-videos', [VodController::class, 'listVideos']);
    Route::get('/vods/{vod}', [VodController::class, 'show']);
    Route::post('/vods', [VodController::class, 'store']);
    Route::put('/vods/{vod}', [VodController::class, 'update']);
    Route::post('/vods', [VodController::class, 'store']);
    Route::delete('/vods/{vod}', [VodController::class, 'delete']);
    Route::get('/vods/ordering/{vod}', [VodController::class, 'ordering']);

});

// Dashboard
Route::group(['middleware' => ['auth:sanctum','role:admin']], function () {
    Route::get('/dashboard', [DashboardController::class, 'index']);
});

// Analytics
Route::group(['middleware' => ['auth:sanctum','role:admin']], function () {
    Route::get('/analytics', [AnalyticsController::class, 'index']);
});

// Activity Log
Route::group(['middleware' => ['auth:sanctum','role:admin']], function () {
    Route::get('/activity', [ActivityController::class, 'index']);
});

// Manage Directories
Route::group(['middleware' => ['auth:sanctum','role:admin']], function () {
    Route::get('/directories/tree', [DirectoryController::class, 'tree']);
    Route::get('/directories/node/{parentId}', [DirectoryController::class, 'index']);
    Route::post('/directories', [DirectoryController::class, 'storeRecord']);
    Route::get('/directories/ordering/{directory}', [DirectoryController::class, 'ordering']);
    Route::get('/directories/{directory}', [DirectoryController::class, 'show']);
    Route::put('/directories/{directory}', [DirectoryController::class, 'update']);
    Route::delete('/directories/{directory}', [DirectoryController::class, 'delete']);
});

// Directory bulk import (external, e.g. Google Apps Script)
Route::post('/directories/sync/{root}', [DirectoryController::class, 'store']);

// GitHub Webhook (no auth — signature-verified in controller)
Route::post('/github-webhook', [GithubWebhookController::class, 'handle']);

// Manage Chat Users
Route::group(['middleware' => ['auth:sanctum','role:admin']], function () {
    Route::get('/chat-users', [ChatUserController::class, 'index']);
    Route::get('/chat-users/{chatUser}', [ChatUserController::class, 'show']);
    Route::put('/chat-users/{chatUser}', [ChatUserController::class, 'update']);
    Route::delete('/chat-users/{chatUser}', [ChatUserController::class, 'delete']);
    Route::patch('/chat-users/{chatUser}/toggle-ban', [ChatUserController::class, 'toggleBan']);
    Route::patch('/chat-users/{chatUser}/verify', [ChatUserController::class, 'verify']);
});

// Manage Chat Messages
Route::group(['middleware' => ['auth:sanctum','role:admin']], function () {
    Route::get('/chat-messages', [ChatMessageController::class, 'index']);
    Route::delete('/chat-messages/{chatMessage}', [ChatMessageController::class, 'destroy']);
    Route::delete('/chat-messages', [ChatMessageController::class, 'clear']);
});

// Manage Complaints
Route::group(['middleware' => ['auth:sanctum','role:admin']], function () {
    Route::get('/complaints', [ComplaintController::class, 'index']);
    Route::get('/complaints/{complaint}', [ComplaintController::class, 'show']);
    Route::delete('/complaints/{complaint}', [ComplaintController::class, 'destroy']);
});
