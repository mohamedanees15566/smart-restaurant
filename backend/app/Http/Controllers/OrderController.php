<?php

namespace App\Http\Controllers;

use App\Events\OrderStatusUpdated;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    // Place a new order
    public function store(Request $request)
    {
        $request->validate([
            'items'                => 'required|array|min:1',
            'items.*.menu_item_id' => 'required|exists:menu_items,id',
            'items.*.quantity'     => 'required|integer|min:1',
            'items.*.unit_price'   => 'required|numeric',
            'total_amount'         => 'required|numeric',
            'notes'                => 'nullable|string',
        ]);

        DB::beginTransaction();
        try {
            $order = Order::create([
                'user_id'      => $request->user()->id,
                'table_id'     => $request->table_id ?? null,
                'status'       => 'placed',
                'total_amount' => $request->total_amount,
                'notes'        => $request->notes,
            ]);

            foreach ($request->items as $item) {
                OrderItem::create([
                    'order_id'     => $order->id,
                    'menu_item_id' => $item['menu_item_id'],
                    'quantity'     => $item['quantity'],
                    'unit_price'   => $item['unit_price'],
                    'notes'        => $item['notes'] ?? null,
                ]);
            }

            DB::commit();
            return response()->json([
                'message' => 'Order placed successfully!',
                'order'   => $order->load('items'),
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Failed to place order.'], 500);
        }
    }

    // Get current user orders
    public function index(Request $request)
    {
        $orders = Order::with('items.menuItem')
            ->where('user_id', $request->user()->id)
            ->orderByDesc('created_at')
            ->get();

        return response()->json($orders);
    }

    // Get single order
    public function show(Request $request, $id)
    {
        $order = Order::with('items.menuItem')
            ->where('user_id', $request->user()->id)
            ->findOrFail($id);

        return response()->json($order);
    }

    // Update order status (staff only)
    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:placed,confirmed,preparing,ready,served,cancelled',
        ]);

        $order = Order::findOrFail($id);
        $order->update(['status' => $request->status]);

        // Broadcast real-time update
        broadcast(new OrderStatusUpdated($order));

        return response()->json([
            'message' => 'Order status updated!',
            'order'   => $order,
        ]);
    }
}