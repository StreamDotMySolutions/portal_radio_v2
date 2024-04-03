<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Kalnoy\Nestedset\NodeTrait;

class Banner extends Model
{
    use HasFactory;
    use NodeTrait;

    protected $guarded = ['id'];
}
