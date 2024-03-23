<?php

namespace App\Http\Requests\Users;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'role' => 'required',
            //'email' => 'required|email|unique:users,email',
            'email' => ['required','email', Rule::unique('users')->whereNull('deleted_at')],
            //'password' => 'required|min:6',
            'password' => 'required_if:password_present,true|min:6',
            'name' => 'required',
            'address' => 'required',         
        ];
    }
}
