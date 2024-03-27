<?php

namespace App\Http\Requests\ArticleContens;
use Illuminate\Validation\Rule;
use Illuminate\Foundation\Http\FormRequest;

class DeleteRequest extends FormRequest
{

    public function rules(): array
    {
       //\Log::info($this->user);
        return [
            'acknowledge' => 'required',
           
        ];
    }
}
