<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\MenuController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\QrController;
use App\Http\Controllers\QueueController;
use App\Http\Controllers\StaffController;

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);

// Public menu routes
Route::get('/menu/categories', [MenuController::class, 'categories']);
Route::get('/menu/items',      [MenuController::class, 'items']);
Route::get('/menu/items/{id}', [MenuController::class, 'show']);

// QR Code scan
Route::get('/table/{tableNumber}/scan', [QrController::class, 'scan']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me',      [AuthController::class, 'me']);

    // Orders
    Route::get('/orders',               [OrderController::class, 'index']);
    Route::post('/orders',              [OrderController::class, 'store']);
    Route::get('/orders/{id}',          [OrderController::class, 'show']);
    Route::patch('/orders/{id}/status', [OrderController::class, 'updateStatus']);

    // Queue
    Route::get('/queue',           [QueueController::class, 'index']);
    Route::post('/queue/join',     [QueueController::class, 'join']);
    Route::get('/queue/my-status', [QueueController::class, 'myStatus']);
    Route::post('/queue/leave',    [QueueController::class, 'leave']);

    // Staff only
    Route::middleware('role:staff,admin')->group(function () {
        Route::post('/queue/call-next',      [QueueController::class, 'callNext']);
        Route::patch('/queue/{id}/seated',   [QueueController::class, 'markSeated']);
        Route::delete('/queue/{id}',         [QueueController::class, 'remove']);
        Route::get('/staff/orders',          [StaffController::class, 'orders']);
        Route::patch('/staff/orders/{id}/status', [StaffController::class, 'updateOrderStatus']);
        Route::get('/staff/tables',          [StaffController::class, 'tables']);
        Route::patch('/staff/tables/{id}/status', [StaffController::class, 'updateTableStatus']);
    });
});