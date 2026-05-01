<?php

namespace App\Http\Controllers;

use App\Events\OrderStatusUpdated;
use App\Models\Order;
use App\Models\Table;
use Illuminate\Http\Request;

class StaffController extends Controller
{
    // Get all active orders
    public function orders()
    {
        $orders = Order::with('items.menuItem', 'user', 'table')
            ->whereNotIn('status', ['served', 'cancelled'])
            ->orderBy('created_at')
            ->get();

        return response()->json($orders);
    }

    // Update order status
    public function updateOrderStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:placed,confirmed,preparing,ready,served,cancelled',
        ]);

        $order = Order::findOrFail($id);
        $order->update(['status' => $request->status]);

        broadcast(new OrderStatusUpdated($order));

        return response()->json([
            'message' => 'Order status updated!',
            'order'   => $order,
        ]);
    }

    // Get all tables
    public function tables()
    {
        $tables = Table::where('is_active', true)
            ->orderBy('table_number')
            ->get();

        return response()->json($tables);
    }

    // Update table status
    public function updateTableStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:available,occupied,reserved',
        ]);

        $table = Table::findOrFail($id);
        $table->update(['status' => $request->status]);

        return response()->json([
            'message' => 'Table status updated!',
            'table'   => $table,
        ]);
    }
}