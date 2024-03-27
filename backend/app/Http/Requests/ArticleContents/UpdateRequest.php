<?php
namespace App\Http\Requests\ArticleContents;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'contents' => 'sometimes|required',
        ];
    }
}
