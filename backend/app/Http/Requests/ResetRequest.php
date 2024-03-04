<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ResetRequest extends FormRequest
{

    public function authorize()
    {
        return true;
    }


    //  'password' => ['required', 'confirmed', RulesPassword::defaults()],
    public function rules()
    {
        return [
            'token' => 'required',
            'email' => 'required|string|email|exists:users,email',
            'password' => 'required|min:6|confirmed'
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
            'token.required' => 'Missing token',

            'email.required' => 'Sila isi alamat emel anda',
            'email.string' => 'Sila betulkan alamat emel anda',
            'email.email' => 'Sila betulkan alamat emel anda',
            'email.exists' => 'Alamat email tidak wujud',
        ];
    }
}