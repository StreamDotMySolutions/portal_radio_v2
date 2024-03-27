<?php

namespace App\Http\Requests\ArticleContents;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'contents' => 'required',
        ];
    }
}
