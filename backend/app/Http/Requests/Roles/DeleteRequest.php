<?php
namespace App\Http\Requests\Roles;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class DeleteRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'acknowledge' => 'required',
        ];
    }
}
