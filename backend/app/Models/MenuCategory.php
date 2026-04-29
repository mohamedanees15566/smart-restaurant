<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MenuCategory extends Model
{
    protected $fillable = ['name', 'description', 'image', 'sort_order', 'is_active'];

    public function items()
    {
        return $this->hasMany(MenuItem::class, 'category_id');
    }
}