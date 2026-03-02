<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ArticlePdf extends Model
{
    use HasFactory;
    protected $guarded = ['id'];

    public function articleData()
    {
        return $this->belongsTo(ArticleData::class);
    }
}
