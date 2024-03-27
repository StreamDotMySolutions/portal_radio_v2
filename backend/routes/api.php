<?php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\{
    RoleController,
    UserController,
    AuthController,
    AccountController,
    ArticleController,
    ArticlePosterController,
    ArticleContentController,
    ArticleAssetController,
};

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
    Route::get('/articles-data/node/{parentId}', [ArticleController::class, 'articlesData']);

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
});
