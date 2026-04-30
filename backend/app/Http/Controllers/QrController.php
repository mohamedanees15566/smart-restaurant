<?php

namespace App\Http\Controllers;

use App\Models\Table;
use Illuminate\Http\Request;

class QrController extends Controller
{
    public function scan($tableNumber)
    {
        $table = Table::where('table_number', $tableNumber)
            ->where('is_active', true)
            ->firstOrFail();

        return response()->json([
            'table_id'     => $table->id,
            'table_number' => $table->table_number,
            'capacity'     => $table->capacity,
            'location'     => $table->location,
            'status'       => $table->status,
        ]);
    }
}