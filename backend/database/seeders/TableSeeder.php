<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TableSeeder extends Seeder
{
    public function run(): void
    {
        $tables = [];
        for ($i = 1; $i <= 10; $i++) {
            $tables[] = [
                'table_number' => 'T' . str_pad($i, 2, '0', STR_PAD_LEFT),
                'capacity'     => $i <= 4 ? 2 : ($i <= 8 ? 4 : 6),
                'location'     => $i <= 4 ? 'Indoor' : ($i <= 8 ? 'Outdoor' : 'VIP'),
                'status'       => 'available',
                'is_active'    => true,
                'created_at'   => now(),
                'updated_at'   => now(),
            ];
        }
        DB::table('tables')->insert($tables);
    }
}