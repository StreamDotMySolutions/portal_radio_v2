<?php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\{
    RoleController,
    UserController,
    AuthController,
    AccountController,
};

Auth::routes();

Route::get('/welcome', function () {
    return response()->json(['message' => 'hello']);
});

// Role guest
Route::group(['middleware' => ['guest']], function () {
    // Auth-related routes
    Route::post('/register', [AuthController::class, 'register'])->name('register');
    Route::post('/login', [AuthController::class, 'login'])->name('login');
    Route::post('/password/email', [AuthController::class, 'email']);
    Route::post('/password/reset', [AuthController::class, 'resetPassword']);
    Route::get('/user-departments', [UserDepartmentController::class, 'index']);
});

// Role user
Route::group(['middleware' => ['auth:sanctum']], function () {
    Route::get('/account', [AccountController::class, 'show']);
    Route::put('/account', [AccountController::class, 'update']);
    Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum')->name('logout');
});

// Role system|admin 
Route::group(['middleware' => ['auth:sanctum','role:admin']], function () {
    // User-related routes
    Route::get('/users', [UserController::class, 'index']);
    Route::get('/users/roles', [UserController::class, 'roles']);
    Route::post('/users', [UserController::class, 'store']);
    Route::get('/users/{user}', [UserController::class, 'show']);
    Route::put('/users/{user}', [UserController::class, 'update']);
    Route::delete('/users/{user}', [UserController::class, 'delete']);
});

// Manage Roles
Route::group(['middleware' => ['auth:sanctum','role:admin']], function () {
    // Roles
    Route::get('/roles', [RoleController::class, 'index']);
    Route::post('/roles', [RoleController::class, 'store']);
    Route::get('/roles/{role}', [RoleController::class, 'show']);
    Route::put('/roles/{role}', [RoleController::class, 'update']);
    Route::delete('/roles/{role}', [RoleController::class, 'delete']);
});


// Manage Users
Route::group(['middleware' => ['auth:sanctum','role:admin']], function () {
    // Users
    Route::get('/users', [UserController::class, 'index']);
    Route::post('/users', [UserController::class, 'store']);
    Route::get('/users/{role}', [UserController::class, 'show']);
    Route::put('/users/{role}', [UserController::class, 'update']);
    Route::delete('/users/{role}', [UserController::class, 'delete']);
});