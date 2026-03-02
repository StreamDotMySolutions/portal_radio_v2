<?php
namespace App\Services;

use App\Models\User;
use App\Models\UserProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AccountService
{
    public static function show()
    {
        // loggedInUser
        $user =  auth('sanctum')->user();

        // User, Profile
        $user = User::where('id',$user->id)->with(['profile'])->first();

        // Role;
        $user['role'] = $user->roles->pluck('name')[0];

        return $user;

    }

    public static function update($request)
    {
        //\Log::info($request);
        
        $user = User::where('id', auth('sanctum')->user()->id)->first();
        
        if($request->has('email')){
            $user->update($request->only('email'));
        }

        if($request->filled('password')){
            $user->update([ 'password' => Hash::make($request->input('password')) ] );
        }

        if($request->has('name')){
            $user->update($request->only('name'));
            //$user->profile->update($request->only('name'));
        }

    
        if($request->has('address')){
            $user->profile->update($request->only('address'));
        }

    }


}