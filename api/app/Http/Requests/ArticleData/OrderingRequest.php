<?php

namespace App\Http\Requests\ArticleData;

use Illuminate\Foundation\Http\FormRequest;

class OrderingRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'direction' => 'required|in:up,down',
        ];
    }
}
