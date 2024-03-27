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

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function articleData()
    {
        return $this->hasMany(ArticleData::class);
    }
    
    public function articlePoster()
    {
        return $this->hasOne(ArticlePoster::class)->latest();
    }

    public function articleContent()
    {
        return $this->hasOne(ArticleContent::class)->latest();
    }

    public function articleAssets()
    {
        return $this->hasMany(ArticleAssets::class);
    }
}