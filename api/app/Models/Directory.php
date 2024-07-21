<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Kalnoy\Nestedset\NodeTrait;

class Directory extends Model
{
    use NodeTrait;

    protected $guarded = ['id'];
    //protected $fillable = ['name', 'type'];

    // Add a local scope
    public function scopeFullTextSearch($query, $term)
    {
        //return $query->whereRaw("MATCH(name,occupation,email,phone,address) AGAINST(? IN NATURAL LANGUAGE MODE)", [$term]);
        return $query->whereRaw("MATCH(name, occupation, email, phone, address) AGAINST(? IN NATURAL LANGUAGE MODE)", [$term]);
    }
}
