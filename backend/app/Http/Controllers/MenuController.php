<?php

namespace App\Http\Controllers;

use App\Models\MenuCategory;
use App\Models\MenuItem;
use Illuminate\Http\Request;

class MenuController extends Controller
{
    // Get all categories with their items
    public function categories()
    {
        $categories = MenuCategory::where('is_active', true)
            ->orderBy('sort_order')
            ->get();
        return response()->json($categories);
    }

    // Get all menu items with search and filter
    public function items(Request $request)
    {
        $query = MenuItem::with('category')
            ->where('is_available', true);

        // Search by name
        if ($request->has('search') && $request->search) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        // Filter by category
        if ($request->has('category_id') && $request->category_id) {
            $query->where('category_id', $request->category_id);
        }

        $items = $query->orderBy('name')->get();
        return response()->json($items);
    }

    // Get single item
    public function show($id)
    {
        $item = MenuItem::with('category')->findOrFail($id);
        return response()->json($item);
    }
}