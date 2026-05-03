<?php

namespace App\Http\Controllers;

use App\Models\Review;
use App\Models\Order;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    // Submit a review
    public function store(Request $request)
    {
        $request->validate([
            'order_id' => 'required|exists:orders,id',
            'rating'   => 'required|integer|min:1|max:5',
            'comment'  => 'nullable|string|max:500',
        ]);

        // Check if order belongs to user
        $order = Order::where('id', $request->order_id)
            ->where('user_id', $request->user()->id)
            ->where('status', 'served')
            ->firstOrFail();

        // Check if already reviewed
        $existing = Review::where('order_id', $order->id)->first();
        if ($existing) {
            return response()->json(['message' => 'You have already reviewed this order.'], 409);
        }

        $review = Review::create([
            'user_id'    => $request->user()->id,
            'order_id'   => $request->order_id,
            'rating'     => $request->rating,
            'comment'    => $request->comment,
            'is_visible' => true,
        ]);

        return response()->json([
            'message' => 'Review submitted successfully!',
            'review'  => $review,
        ], 201);
    }

    // Get all reviews (public)
    public function index()
    {
        $reviews = Review::with('user')
            ->where('is_visible', true)
            ->orderByDesc('created_at')
            ->limit(20)
            ->get();

        return response()->json($reviews);
    }

    // Get my reviews
    public function myReviews(Request $request)
    {
        $reviews = Review::with('order')
            ->where('user_id', $request->user()->id)
            ->orderByDesc('created_at')
            ->get();

        return response()->json($reviews);
    }
}