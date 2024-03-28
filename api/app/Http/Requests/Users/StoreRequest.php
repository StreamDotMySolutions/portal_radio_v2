<?php

namespace App\Http\Requests\Users;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'name' => 'required',
            'role_id' => 'required',
            //'email' => 'required|email|unique:users,email',
            'email' => ['required','email', Rule::unique('users')->whereNull('deleted_at')],
            //'password' => 'required|min:6',
            //'password' => 'required_if:password_present,true|min:6',
            'password' => 'required|min:6|confirmed',    
        ];
    }

    public function messages(): array
    {
        return [
            'role_id.required' => 'Please select a role.', // Custom error message for role_id field
        ];
    }
}
