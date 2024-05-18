<?php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Backend\{
    RoleController,
    UserController,
    AuthController,
    AccountController,
    ArticleController,
    ArticlePosterController,
    ArticleContentController,
    ArticleAssetController,
    ArticleDataController,
    ArticleSettingController,
    BannerController,
    ProgrammeController,
    VideoController,
    DirectoryController,
    DirectorySyncController,
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

    Route::get('/article-data/node/{parentId}', [ArticleDataController::class, 'index']);
    Route::get('/article-data/ordering/{articleData}', [ArticleDataController::class, 'ordering']);
    Route::post('/article-data', [ArticleDataController::class, 'store']);
    Route::get('/article-data/{articleData}', [ArticleDataController::class, 'show']);
    Route::put('/article-data/{articleData}', [ArticleDataController::class, 'update']);
    Route::delete('/article-data/{articleData}', [ArticleDataController::class, 'delete']);

    // Article Settings
    Route::get('/article-settings/{article}', [ArticleSettingController::class, 'show']);
    Route::put('/article-settings/{article}', [ArticleSettingController::class, 'update']);

    
    // Banner Settings
    Route::get('/banners', [BannerController::class, 'index']);
    Route::get('/banners/{banner}', [BannerController::class, 'show']);
    Route::post('/banners', [BannerController::class, 'store']);
    Route::put('/banners/{banner}', [BannerController::class, 'update']);
    Route::post('/banners', [BannerController::class, 'store']);
    Route::delete('/banners/{banner}', [BannerController::class, 'delete']);
    Route::get('/banners/ordering/{banner}', [BannerController::class, 'ordering']);

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


});

// Directory
Route::group(['middleware' => ['guest']], function () {
    Route::get('/directories', [DirectoryController::class, 'displayDirectoryStructure']);
    Route::get('/directories/{id}', [DirectoryController::class, 'index']);
    Route::post('/directories', [DirectoryController::class, 'store']);
    Route::post('/directory/sync', [DirectorySyncController::class, 'sync']);
});
