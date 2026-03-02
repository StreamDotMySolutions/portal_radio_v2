<?php

namespace App\Http\Requests\Account;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateRequest extends FormRequest
{

    public function rules(): array
    {

        $user =  auth('sanctum')->user();

        return [

            'email' => [
                'sometimes',
                'email',
                // assuming id is pk
                Rule::unique('users', 'email')->ignore($user->id)->whereNull('deleted_at'),
            ],

            'password' => 'sometimes|nullable|min:6|confirmed',

            'name' => 'sometimes|required',
            'occupation' => 'sometimes|required',
            'nric' => [
                'sometimes',
                'string',
                'regex:/^[0-9]{6}-[0-9]{2}-[0-9]{4}$/',

                // different table, need to provide pk
                Rule::unique('users')->ignore($user->id,'id')->whereNull('deleted_at'),
            ],
            'phone' => 'sometimes|required',
            'address' => 'sometimes|required',

            'user_department_id' => 'sometimes|required',
        ];
    }
}
