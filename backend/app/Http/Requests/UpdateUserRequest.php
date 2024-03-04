<?php

namespace App\Http\Requests;
use Illuminate\Validation\Rule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateUserRequest extends FormRequest
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

       //\Log::info($this->user);
        return [
          
                'role' => 'sometimes|required',
                'email' => [
                        'required',
                        'email',
                        // assuming id is pk
                        Rule::unique('users', 'email')->ignore($this->user->id)->whereNull('deleted_at'),
                    ],
                'password' => 'required_if:password_present,true|min:6',

                'name' => 'sometimes|required',
                'occupation' => 'sometimes|required',
                'nric' => [
                    'sometimes',
                    'string',
                    'regex:/^[0-9]{6}-[0-9]{2}-[0-9]{4}$/',

                    // different table, need to provide pk
                    Rule::unique('users')->ignore($this->user->id,'id')->whereNull('deleted_at'),
                ],
                'phone' => 'sometimes|required',
                'address' => 'sometimes|required',

                'user_department_id' => 'sometimes|required',
           
        ];
    }
}
