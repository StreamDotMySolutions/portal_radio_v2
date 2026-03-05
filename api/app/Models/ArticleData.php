<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Kalnoy\Nestedset\NodeTrait;

class ArticleData extends Model
{
    use HasFactory;
    use NodeTrait;
    protected $guarded = ['id'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function article()
    {
        return $this->belongsTo(Article::class);
    }

    public function articleGallery()
    {
        return $this->hasMany(ArticleGallery::class);
    }

    public function articlePdf()
    {
        return $this->hasOne(ArticlePdf::class);
    }

    public function vod()
    {
        return $this->belongsTo(Vod::class);
    }
}
