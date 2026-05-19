<?php

namespace App\Http\Controllers;

use App\Models\MenuItem;
use App\Models\MenuCategory;
use App\Models\Order;
use App\Models\Table;
use App\Models\User;
use App\Models\Queue;
use App\Support\MenuImageStorage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    // Dashboard stats
    public function stats()
    {
        $today = now()->toDateString();

        return response()->json([
            'total_orders'        => Order::count(),
            'today_orders'        => Order::whereDate('created_at', $today)->count(),
            'today_revenue'       => Order::whereDate('created_at', $today)->sum('total_amount'),
            'total_revenue'       => Order::sum('total_amount'),
            'active_queue'        => Queue::whereIn('status', ['waiting', 'called'])->count(),
            'available_tables'    => Table::where('status', 'available')->count(),
            'total_tables'        => Table::count(),
            'total_users'         => User::where('role', 'customer')->count(),
            'total_menu_items'    => MenuItem::count(),
            'pending_orders'      => Order::whereIn('status', ['placed', 'confirmed', 'preparing'])->count(),
        ]);
    }

    // Revenue analytics (last 7 days)
    public function revenueAnalytics()
    {
        $data = Order::select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('SUM(total_amount) as revenue'),
                DB::raw('COUNT(*) as orders')
            )
            ->where('created_at', '>=', now()->subDays(7))
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        return response()->json($data);
    }

    // Top selling items
    public function topItems()
    {
        $data = DB::table('order_items')
            ->join('menu_items', 'order_items.menu_item_id', '=', 'menu_items.id')
            ->select(
                'menu_items.name',
                DB::raw('SUM(order_items.quantity) as total_sold'),
                DB::raw('SUM(order_items.quantity * order_items.unit_price) as revenue')
            )
            ->groupBy('menu_items.id', 'menu_items.name')
            ->orderByDesc('total_sold')
            ->limit(5)
            ->get();

        return response()->json($data);
    }

    // Order status breakdown
    public function orderStats()
    {
        $data = Order::select('status', DB::raw('COUNT(*) as count'))
            ->groupBy('status')
            ->get();

        return response()->json($data);
    }

    // ── USER MANAGEMENT ──

    public function users()
    {
        $users = User::orderByDesc('created_at')->get();
        return response()->json($users);
    }

    public function updateUser(Request $request, $id)
    {
        $request->validate([
            'role'      => 'sometimes|in:customer,staff,admin',
            'is_active' => 'sometimes|boolean',
        ]);

        $user = User::findOrFail($id);
        $user->update($request->only('role', 'is_active'));

        return response()->json([
            'message' => 'User updated!',
            'user'    => $user,
        ]);
    }

    // ── MENU MANAGEMENT ──

    public function menuItems()
    {
        $items = MenuItem::with('category')->orderBy('name')->get();
        return response()->json($items);
    }

    public function createMenuItem(Request $request)
{
    $request->validate([
        'category_id'    => 'required|exists:menu_categories,id',
        'name'           => 'required|string|max:150',
        'description'    => 'nullable|string',
        'price'          => 'required|numeric|min:0',
        'prep_time_mins' => 'nullable|integer',
        'is_available'   => 'boolean',
        'image'          => MenuImageStorage::rules(),
    ]);

    $imagePath = null;
    if ($request->hasFile('image')) {
        $imagePath = MenuImageStorage::store($request->file('image'));
    }

    $item = MenuItem::create([
        'category_id'    => $request->category_id,
        'name'           => $request->name,
        'description'    => $request->description,
        'price'          => $request->price,
        'prep_time_mins' => $request->prep_time_mins ?? 15,
        'is_available'   => $request->boolean('is_available', true),
        'image'          => $imagePath,
    ]);

    return response()->json([
        'message' => 'Menu item created!',
        'item'    => $item,
    ], 201);
}

   public function updateMenuItem(Request $request, $id)
{
    $item = MenuItem::findOrFail($id);

    $request->validate([
        'category_id'    => 'sometimes|required|exists:menu_categories,id',
        'name'           => 'sometimes|required|string|max:150',
        'description'    => 'nullable|string',
        'price'          => 'sometimes|required|numeric|min:0',
        'prep_time_mins' => 'nullable|integer',
        'is_available'   => 'sometimes|boolean',
        'image'          => MenuImageStorage::rules(),
    ]);

    $imagePath = $item->image;
    if ($request->hasFile('image')) {
        if ($item->image) {
            \Illuminate\Support\Facades\Storage::disk('public')->delete($item->image);
        }
        $imagePath = MenuImageStorage::store($request->file('image'));
    }

    $item->update([
        'category_id'    => $request->input('category_id', $item->category_id),
        'name'           => $request->input('name', $item->name),
        'description'    => $request->input('description', $item->description),
        'price'          => $request->input('price', $item->price),
        'prep_time_mins' => $request->input('prep_time_mins', $item->prep_time_mins),
        'is_available'   => $request->has('is_available')
            ? $request->boolean('is_available')
            : $item->is_available,
        'image'          => $imagePath,
    ]);

    return response()->json([
        'message' => 'Menu item updated!',
        'item'    => $item->fresh(),
    ]);
}

    public function deleteMenuItem($id)
    {
        $item = MenuItem::findOrFail($id);
        if ($item->image) {
            \Illuminate\Support\Facades\Storage::disk('public')->delete($item->image);
        }
        $item->delete();

        return response()->json(['message' => 'Menu item deleted!']);
    }

    // ── TABLE MANAGEMENT ──

    public function tables()
    {
        $tables = Table::orderBy('table_number')->get();
        return response()->json($tables);
    }

    public function createTable(Request $request)
    {
        $request->validate([
            'table_number' => 'required|string|unique:tables',
            'capacity'     => 'required|integer|min:1',
            'location'     => 'nullable|string',
        ]);

        $table = Table::create([
            'table_number' => $request->table_number,
            'capacity'     => $request->capacity,
            'location'     => $request->location ?? 'Indoor',
            'status'       => 'available',
            'is_active'    => true,
        ]);

        return response()->json([
            'message' => 'Table created!',
            'table'   => $table,
        ], 201);
    }

    public function updateTable(Request $request, $id)
    {
        $table = Table::findOrFail($id);
        $table->update($request->all());

        return response()->json([
            'message' => 'Table updated!',
            'table'   => $table,
        ]);
    }

    public function deleteTable($id)
    {
        $table = Table::findOrFail($id);
        $table->delete();

        return response()->json(['message' => 'Table deleted!']);
    }

    // ── CATEGORIES ──

    public function categories()
    {
        return response()->json(MenuCategory::orderBy('sort_order')->get());
    }

    public function createCategory(Request $request)
    {
        $request->validate([
            'name'        => 'required|string|max:100',
            'description' => 'nullable|string',
            'sort_order'  => 'nullable|integer',
        ]);

        $category = MenuCategory::create($request->all());

        return response()->json([
            'message'  => 'Category created!',
            'category' => $category,
        ], 201);
    }

    public function deleteCategory($id)
    {
        $category = MenuCategory::findOrFail($id);
        $category->delete();

        return response()->json(['message' => 'Category deleted!']);
    }
}