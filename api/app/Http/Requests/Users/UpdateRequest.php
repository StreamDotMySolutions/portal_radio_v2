<?php

namespace App\Http\Requests\Users;
use Illuminate\Validation\Rule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateRequest extends FormRequest
{

    public function rules(): array
    {
       //\Log::info($this->user);
        return [
            'role' => 'sometimes|required',
            'email' => [
                    'required',
                    'email',
                    // assuming id is pk
                    Rule::unique('users', 'email')->ignore($this->user->id)->whereNull('deleted_at'),
                ],
            'password' => 'required_if:password_present,true|min:6|confirmed',
            'name' => 'sometimes|required',
        ];
    }
}
