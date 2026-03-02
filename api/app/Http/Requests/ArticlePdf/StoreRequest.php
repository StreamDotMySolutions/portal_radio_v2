<?php

namespace App\Http\Requests\ArticlePdf;

use Illuminate\Foundation\Http\FormRequest;

class StoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'article_pdf'     => 'required|mimes:pdf|max:10240',
            'article_data_id' => 'required|integer',
        ];
    }
}
