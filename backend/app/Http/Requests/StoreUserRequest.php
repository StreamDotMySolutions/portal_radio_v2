<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;


class StoreUserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
          
            'role' => 'required',
            //'email' => 'required|email|unique:users,email',
            'email' => ['required','email', Rule::unique('users')->whereNull('deleted_at')],
            //'password' => 'required|min:6',
            'password' => 'required_if:password_present,true|min:6',

            'name' => 'required',
            'occupation' => 'required',
            'nric' => [
                'required',
                'string',
                'regex:/^[0-9]{6}-[0-9]{2}-[0-9]{4}$/',
                //'unique:user_profiles,nric'
                Rule::unique('users')->whereNull('deleted_at')
            ],
            'phone' => 'required',
            'address' => 'required',

            'user_department_id' => 'required',
           
        ];
    }
}
