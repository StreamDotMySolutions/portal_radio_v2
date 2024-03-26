<?php

namespace App\Http\Requests\ArticlePosters;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'article_poster' => 'required',
        ];
    }
}
