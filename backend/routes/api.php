<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\MenuController;
use App\Http\Controllers\OrderController;

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);

// Public menu routes
Route::get('/menu/categories', [MenuController::class, 'categories']);
Route::get('/menu/items',      [MenuController::class, 'items']);
Route::get('/menu/items/{id}', [MenuController::class, 'show']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout',   [AuthController::class, 'logout']);
    Route::get('/me',        [AuthController::class, 'me']);

    // Orders
    Route::get('/orders',    [OrderController::class, 'index']);
    Route::post('/orders',   [OrderController::class, 'store']);
    Route::get('/orders/{id}', [OrderController::class, 'show']);
});