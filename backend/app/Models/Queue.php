<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Queue extends Model
{
    protected $table = 'queue';

    protected $fillable = [
        'user_id', 'queue_number', 'party_size',
        'position', 'status', 'estimated_wait',
        'joined_at', 'called_at', 'seated_at'
    ];

    protected $casts = [
        'joined_at' => 'datetime',
        'called_at' => 'datetime',
        'seated_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}