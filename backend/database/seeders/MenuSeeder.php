<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MenuSeeder extends Seeder
{
    public function run(): void
    {
        // Categories
        $categories = [
            ['name' => 'Starters', 'description' => 'Light bites to begin your meal', 'sort_order' => 1, 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Main Course', 'description' => 'Hearty and delicious main dishes', 'sort_order' => 2, 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Rice & Noodles', 'description' => 'Classic rice and noodle dishes', 'sort_order' => 3, 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Desserts', 'description' => 'Sweet treats to end your meal', 'sort_order' => 4, 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Drinks', 'description' => 'Fresh juices, shakes and more', 'sort_order' => 5, 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
        ];

        DB::table('menu_categories')->insert($categories);

        // Items
        $items = [
            // Starters
            ['category_id' => 1, 'name' => 'Spring Rolls', 'description' => 'Crispy golden rolls filled with vegetables', 'price' => 4.50, 'is_available' => true, 'prep_time_mins' => 10, 'created_at' => now(), 'updated_at' => now()],
            ['category_id' => 1, 'name' => 'Chicken Wings', 'description' => 'Spicy grilled chicken wings with dipping sauce', 'price' => 6.50, 'is_available' => true, 'prep_time_mins' => 15, 'created_at' => now(), 'updated_at' => now()],
            ['category_id' => 1, 'name' => 'Soup of the Day', 'description' => 'Fresh homemade soup served with bread', 'price' => 3.50, 'is_available' => true, 'prep_time_mins' => 8, 'created_at' => now(), 'updated_at' => now()],
            ['category_id' => 1, 'name' => 'Garlic Bread', 'description' => 'Toasted bread with garlic butter and herbs', 'price' => 2.50, 'is_available' => true, 'prep_time_mins' => 5, 'created_at' => now(), 'updated_at' => now()],

            // Main Course
            ['category_id' => 2, 'name' => 'Grilled Chicken', 'description' => 'Juicy grilled chicken breast with herbs and lemon', 'price' => 12.00, 'is_available' => true, 'prep_time_mins' => 20, 'created_at' => now(), 'updated_at' => now()],
            ['category_id' => 2, 'name' => 'Beef Steak', 'description' => 'Tender beef steak cooked to your liking', 'price' => 18.00, 'is_available' => true, 'prep_time_mins' => 25, 'created_at' => now(), 'updated_at' => now()],
            ['category_id' => 2, 'name' => 'Fish & Chips', 'description' => 'Crispy battered fish with golden fries', 'price' => 11.00, 'is_available' => true, 'prep_time_mins' => 20, 'created_at' => now(), 'updated_at' => now()],
            ['category_id' => 2, 'name' => 'Veggie Burger', 'description' => 'Plant-based burger with fresh vegetables', 'price' => 9.00, 'is_available' => true, 'prep_time_mins' => 15, 'created_at' => now(), 'updated_at' => now()],

            // Rice & Noodles
            ['category_id' => 3, 'name' => 'Fried Rice', 'description' => 'Wok-fried rice with egg, vegetables and soy sauce', 'price' => 7.00, 'is_available' => true, 'prep_time_mins' => 12, 'created_at' => now(), 'updated_at' => now()],
            ['category_id' => 3, 'name' => 'Chicken Noodles', 'description' => 'Stir-fried noodles with chicken and vegetables', 'price' => 8.00, 'is_available' => true, 'prep_time_mins' => 12, 'created_at' => now(), 'updated_at' => now()],
            ['category_id' => 3, 'name' => 'Biryani', 'description' => 'Aromatic spiced rice with tender chicken', 'price' => 10.00, 'is_available' => true, 'prep_time_mins' => 20, 'created_at' => now(), 'updated_at' => now()],
            ['category_id' => 3, 'name' => 'Pasta Carbonara', 'description' => 'Creamy pasta with bacon and parmesan', 'price' => 9.50, 'is_available' => true, 'prep_time_mins' => 15, 'created_at' => now(), 'updated_at' => now()],

            // Desserts
            ['category_id' => 4, 'name' => 'Chocolate Cake', 'description' => 'Rich moist chocolate cake with ganache', 'price' => 5.00, 'is_available' => true, 'prep_time_mins' => 5, 'created_at' => now(), 'updated_at' => now()],
            ['category_id' => 4, 'name' => 'Ice Cream', 'description' => 'Three scoops of your choice of flavour', 'price' => 4.00, 'is_available' => true, 'prep_time_mins' => 3, 'created_at' => now(), 'updated_at' => now()],
            ['category_id' => 4, 'name' => 'Cheesecake', 'description' => 'Creamy New York style cheesecake', 'price' => 5.50, 'is_available' => true, 'prep_time_mins' => 5, 'created_at' => now(), 'updated_at' => now()],

            // Drinks
            ['category_id' => 5, 'name' => 'Fresh Orange Juice', 'description' => 'Freshly squeezed orange juice', 'price' => 3.00, 'is_available' => true, 'prep_time_mins' => 3, 'created_at' => now(), 'updated_at' => now()],
            ['category_id' => 5, 'name' => 'Mango Lassi', 'description' => 'Creamy mango yoghurt drink', 'price' => 3.50, 'is_available' => true, 'prep_time_mins' => 3, 'created_at' => now(), 'updated_at' => now()],
            ['category_id' => 5, 'name' => 'Iced Coffee', 'description' => 'Chilled coffee with milk and ice', 'price' => 3.50, 'is_available' => true, 'prep_time_mins' => 3, 'created_at' => now(), 'updated_at' => now()],
            ['category_id' => 5, 'name' => 'Mineral Water', 'description' => 'Still or sparkling mineral water', 'price' => 1.50, 'is_available' => true, 'prep_time_mins' => 1, 'created_at' => now(), 'updated_at' => now()],
        ];

        DB::table('menu_items')->insert($items);
    }
}