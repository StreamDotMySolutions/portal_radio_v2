<?php
namespace App\Http\Requests\ArticleData;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'title' => 'sometimes|required',
        ];
    }
}
