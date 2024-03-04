<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateAccountRequest extends FormRequest
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

        $user =  auth('sanctum')->user();

        return [

            'email' => [
                'sometimes',
                'email',
                // assuming id is pk
                Rule::unique('users', 'email')->ignore($user->id)->whereNull('deleted_at'),
            ],

            'password' => 'required_if:password_present,true|min:6',

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
