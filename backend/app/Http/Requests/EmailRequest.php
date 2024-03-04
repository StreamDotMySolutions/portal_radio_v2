<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class EmailRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }


    public function rules()
    {
        return [
            'email' => 'required|string|email|exists:users,email'
        ];
    }

    /**
     * Get the error messages for the defined validation rules.
     *
     * @return array
     */
    public function messages()
    {
        return [
            'email.required' => 'Email is required',
            'email.string' => 'Sila betulkan alamat emel anda',
            'email.email' => 'Invalid email address',
            'email.exists' => 'Email not exists in our system',
        ];
    }

}
