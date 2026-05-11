<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StationListener extends Model
{
    protected $guarded = ['id'];

    protected $casts = [
        'last_seen_at' => 'datetime',
    ];
}
