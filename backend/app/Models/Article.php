<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Kalnoy\Nestedset\NodeTrait;


class Article extends Model
{
    use HasFactory;
    use NodeTrait;
 
    protected $guarded = ['id'];
    
}