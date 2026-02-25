<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ArticleSetting extends Model
{
    use HasFactory;
    protected $guarded = ['id'];

   
/**
     * Check if the article is currently published.
     *
     * @param  int  $articleId
     * @return bool
     */
    public static function isPublished($articleId)
    {
        $articleSetting = static::where('article_id', $articleId)->first();

        if (!$articleSetting) {
            //\Log::info('no setting');
            return false; // Article setting not found, consider it not published
        }

        $currentDate = now();

        // Check if published_start is not null and current date is on or after published_start
        $isPublished = $articleSetting->published_start && $articleSetting->published_start <= $currentDate;

        // If published_end is not null, check if current date is on or before published_end
        if ($articleSetting->published_end) {
            $isPublished = $isPublished && $articleSetting->published_end >= $currentDate;
        }

        return $isPublished;
    }

    // casting format dd/mm/yyyy
    protected $casts = [    
        'created_at' => 'datetime:d/m/Y',
        'updated_at' => 'datetime:d/m/Y',
    ];

}
