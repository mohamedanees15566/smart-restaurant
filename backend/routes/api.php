<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\MenuController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\QrController;
use App\Http\Controllers\QueueController;
use App\Http\Controllers\StaffController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\ReservationController;

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);

// Public menu routes
Route::get('/menu/categories', [MenuController::class, 'categories']);
Route::get('/menu/items',      [MenuController::class, 'items']);
Route::get('/menu/items/{id}', [MenuController::class, 'show']);

// Public reviews
Route::get('/reviews', [ReviewController::class, 'index']);

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

    // Reviews
    Route::post('/reviews',      [ReviewController::class, 'store']);
    Route::get('/reviews/mine',  [ReviewController::class, 'myReviews']);

    // Notifications
    Route::get('/notifications',           [NotificationController::class, 'index']);
    Route::get('/notifications/unread',    [NotificationController::class, 'unreadCount']);
    Route::patch('/notifications/{id}/read', [NotificationController::class, 'markRead']);
    Route::post('/notifications/read-all', [NotificationController::class, 'markAllRead']);

    // Payment
    Route::post('/payment/intent',   [PaymentController::class, 'createIntent']);
    Route::post('/payment/confirm',  [PaymentController::class, 'confirmPayment']);
    Route::get('/payment/history',   [PaymentController::class, 'paymentHistory']);

    // Staff only
    Route::middleware('role:staff,admin')->group(function () {
        Route::post('/queue/call-next',           [QueueController::class, 'callNext']);
        Route::patch('/queue/{id}/seated',        [QueueController::class, 'markSeated']);
        Route::delete('/queue/{id}',              [QueueController::class, 'remove']);
        Route::get('/staff/orders',               [StaffController::class, 'orders']);
        Route::patch('/staff/orders/{id}/status', [StaffController::class, 'updateOrderStatus']);
        Route::get('/staff/tables',               [StaffController::class, 'tables']);
        Route::patch('/staff/tables/{id}/status', [StaffController::class, 'updateTableStatus']);
    });

    // Admin only
    Route::middleware('role:admin')->group(function () {
        Route::get('/admin/stats',             [AdminController::class, 'stats']);
        Route::get('/admin/analytics/revenue', [AdminController::class, 'revenueAnalytics']);
        Route::get('/admin/analytics/items',   [AdminController::class, 'topItems']);
        Route::get('/admin/analytics/orders',  [AdminController::class, 'orderStats']);
        Route::get('/admin/users',             [AdminController::class, 'users']);
        Route::patch('/admin/users/{id}',      [AdminController::class, 'updateUser']);
        Route::get('/admin/menu/items',        [AdminController::class, 'menuItems']);
        Route::post('/admin/menu/items',       [AdminController::class, 'createMenuItem']);
        Route::patch('/admin/menu/items/{id}', [AdminController::class, 'updateMenuItem']);
        Route::delete('/admin/menu/items/{id}',[AdminController::class, 'deleteMenuItem']);
        Route::get('/admin/categories',        [AdminController::class, 'categories']);
        Route::post('/admin/categories',       [AdminController::class, 'createCategory']);
        Route::delete('/admin/categories/{id}',[AdminController::class, 'deleteCategory']);
        Route::get('/admin/tables',            [AdminController::class, 'tables']);
        Route::post('/admin/tables',           [AdminController::class, 'createTable']);
        Route::patch('/admin/tables/{id}',     [AdminController::class, 'updateTable']);
        Route::delete('/admin/tables/{id}',    [AdminController::class, 'deleteTable']);
    });
    
    // Profile
    Route::patch('/profile', function(\Illuminate\Http\Request $request) {
    $request->validate([
        'name'  => 'required|string|max:255',
        'phone' => 'nullable|string|max:20',
    ]);
    $user = $request->user();
    $user->update($request->only('name', 'phone'));
    return response()->json(['user' => $user]);
    });

    // Reservations
    Route::get('/reservations/available-tables', [ReservationController::class, 'availableTables']);
    Route::post('/reservations',                 [ReservationController::class, 'store']);
    Route::get('/reservations/mine',             [ReservationController::class, 'myReservations']);
    Route::patch('/reservations/{id}/cancel',    [ReservationController::class, 'cancel']);

    // Staff reservations
    Route::middleware('role:staff,admin')->group(function () {
    Route::get('/reservations',              [ReservationController::class, 'allReservations']);
    Route::patch('/reservations/{id}/confirm', [ReservationController::class, 'confirm']);
});

});