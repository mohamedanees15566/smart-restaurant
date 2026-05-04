<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Notification;
use Illuminate\Http\Request;
use Stripe\Stripe;
use Stripe\PaymentIntent;

class PaymentController extends Controller
{
    public function createIntent(Request $request)
    {
        $request->validate([
            'order_id' => 'required|exists:orders,id',
        ]);

        $order = Order::where('id', $request->order_id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        if ($order->paid_at) {
            return response()->json(['message' => 'Order already paid.'], 409);
        }

        Stripe::setApiKey(env('STRIPE_SECRET'));

        $intent = PaymentIntent::create([
            'amount'   => (int)($order->total_amount * 100), // cents
            'currency' => 'usd',
            'metadata' => [
                'order_id' => $order->id,
                'user_id'  => $request->user()->id,
            ],
        ]);

        return response()->json([
            'client_secret' => $intent->client_secret,
            'amount'        => $order->total_amount,
        ]);
    }

    public function confirmPayment(Request $request)
    {
        $request->validate([
            'order_id'         => 'required|exists:orders,id',
            'payment_intent_id' => 'required|string',
        ]);

        $order = Order::where('id', $request->order_id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        Stripe::setApiKey(env('STRIPE_SECRET'));

        $intent = PaymentIntent::retrieve($request->payment_intent_id);

        if ($intent->status === 'succeeded') {
            $order->update([
                'paid_at'        => now(),
                'payment_method' => 'stripe',
            ]);

            // Notify customer
            Notification::create([
                'user_id' => $request->user()->id,
                'type'    => 'payment_success',
                'title'   => 'Payment Successful! 💳',
                'message' => 'Your payment for order #' . $order->id . ' was successful.',
                'data'    => ['order_id' => $order->id],
            ]);

            return response()->json([
                'message' => 'Payment successful!',
                'order'   => $order,
            ]);
        }

        return response()->json(['message' => 'Payment not completed.'], 400);
    }

    public function paymentHistory(Request $request)
    {
        $orders = Order::where('user_id', $request->user()->id)
            ->whereNotNull('paid_at')
            ->orderByDesc('paid_at')
            ->get();

        return response()->json($orders);
    }
}