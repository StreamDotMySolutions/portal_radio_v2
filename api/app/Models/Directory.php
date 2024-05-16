<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Kalnoy\Nestedset\NodeTrait;

class Directory extends Model
{
    use NodeTrait;

    protected $guarded = ['id'];
    //protected $fillable = ['name', 'type'];
}
