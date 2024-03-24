<?php
namespace App\Services;

use App\Models\User;
use App\Models\UserProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserService
{

    public static function index()
    {
           
        $paginate = User::query()
                        ->with('profile')
                        ->with('roles');
                        // ->whereHas('roles', function($q) use ($role) {
                        //     $q->whereIn('name', [$role]);
                        // })
                        // ->where('is_approved', false);
        $users = $paginate->orderBy('id','DESC')->paginate(25)->withQueryString();

        return $users;
    }


    // 'role' => 'admin',
    // 'email' => 'user@local',
    // 'password' => 'password',
    // 'name' => 'xxx',
    // 'occupation' => 'xxx',
    // 'nric' => '800125-12-1233',
    // 'phone' => 'xxx',
    // 'address' => 'xxx',
    // 'user_department_id' => '4',
    public static function store(Request $request){
        
        // User
        if ($request->has('password')) {
            // If a password is provided, create a user with the provided password.
            $user = User::create([
                'name' => $request->input('name'),
                'is_approved' => true,
                'email' => $request->input('email'),
                'password' => Hash::make($request->input('password')),
            ]);
        } else {
            // If no password is provided, create a user with a random password.
            //$randomPassword = Str::random(10); // Generate a random password
            $user = User::create([
                'name' => $request->input('name'),
                'is_approved' => true,
                'email' => $request->input('email'),
                'password' => Hash::make('password'),// password is password
            ]);
        }
        
        // Get RoleName
        $role = \App\Models\Role::find($request->input('role_id'));
        $user->guard_name = 'web';
        $user->assignRole($role->name);

        // insert into UserProfile
        // $profile = $request->merge(['user_id' => $user->id]);
        // return UserProfile::create($profile->except(['email','password','name']));
    }

    public static function approve($user)
    {
        return User::where('id', $user->id)->update(['is_approved' => true]);
    }

    public static function disable($user)
    {
        return User::where('id', $user->id)->update(['is_approved' => false]);
    }

    public static function update(Request $request, $user){
        
        // User
        if ($request->has('password')) {
            // If a password is provided, create a user with the provided password.
            $password = Hash::make($request->input('password'));
            User::where('id', $user->id)->update(['password' => $password]);
        } 

        // Role
        if ($request->has('role_id')) {

            $role = \App\Models\Role::find($request->input('role_id'));
            $user->syncRoles([]);
            $user->assignRole($role->name);
            //$user->syncRoles($role->name);
        }

        // Email
        if ($request->has('email')) {
            // if change role
             User::where('id', $user->id)->update($request->only(['email']));
        }

        // Name
        if ($request->has('name')) {
            // if change role
                User::where('id', $user->id)->update($request->only(['name']));
        }

    }

    public static function show($user){
        // User, Profile
        if ($user->roles->isNotEmpty()) {
            // Assign the first role's name to the 'role' key
            $user['role'] = $user->roles->first()->name;
            
            // Assign the first role's id to the 'role_id' key
            $user['role_id'] = $user->roles->first()->id;
        } else {
            // If user has no roles
            $user['role'] = null;
            $user['role_id'] = null;
        }

        return $user;
    }



    public static function delete($user)
    {

        // Delete in User
        if ($user) {

            $profile = $user->profile;

            if ($profile) {
                // If the user has a profile, delete it
                $profile->delete();
            }

            // If the user with the given ID is found, delete it
            $user->delete();
        } 
    }
}
