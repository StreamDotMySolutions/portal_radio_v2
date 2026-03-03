<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Kalnoy\Nestedset\NodeTrait;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;

class Directory extends Model
{
    use NodeTrait;
    use LogsActivity;

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()->logUnguarded()->logOnlyDirty();
    }

    protected $guarded = ['id'];
    //protected $fillable = ['name', 'type'];

    // Add a local scope
    // public function scopeFullTextSearch($query, $term)
    // {
    //     //return $query->whereRaw("MATCH(name,occupation,email,phone,address) AGAINST(? IN NATURAL LANGUAGE MODE)", [$term]);
    //     return $query->whereRaw("MATCH(name, occupation, email, phone, address) AGAINST(? IN NATURAL LANGUAGE MODE)", [$term]);
    // }

    // public function scopeFullTextSearch($query, $term)
    // {
    //     return $query->selectRaw("*, MATCH(name, occupation, email, phone, address) AGAINST(?) AS relevancy", [$term])
    //                 ->whereRaw("MATCH(name, occupation, email, phone, address) AGAINST(? IN NATURAL LANGUAGE MODE)", [$term])
    //                 ->orderByDesc('relevancy');
    // }

    // public function scopeFullTextSearch($query, $term)
    // {
    //     // Escaping quotes for the term to ensure it is treated as a phrase
    //     $escapedTerm = '"' . addslashes($term) . '"';
        
    //     return $query->selectRaw("*, MATCH(name, occupation, email, phone, address) AGAINST(? IN BOOLEAN MODE) AS relevancy", [$escapedTerm])
    //                 ->whereRaw("MATCH(name, occupation, email, phone, address) AGAINST(? IN BOOLEAN MODE)", [$escapedTerm])
    //                 ->orderByDesc('relevancy');
    // }

    public function scopeFullTextSearch($query, $term)
    {
        $escapedTerm = '+' . addslashes($term) . '*';

        return $query->selectRaw("*, MATCH(name, occupation, email, phone, address) AGAINST(? IN BOOLEAN MODE) AS relevancy", [$escapedTerm])
                     ->whereRaw("MATCH(name, occupation, email, phone, address) AGAINST(? IN BOOLEAN MODE)", [$escapedTerm])
                     ->orderByDesc('relevancy');
    }

}
