<?php
namespace App\Services;

use App\Models\User;
use App\Models\UserProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserService
{
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
                'nric' => $request->input('nric'),
                'is_approved' => true,
                'email' => $request->input('email'),
                'password' => Hash::make($request->input('password')),
            ]);
        } else {
            // If no password is provided, create a user with a random password.
            //$randomPassword = Str::random(10); // Generate a random password
            $user = User::create([
                'name' => $request->input('name'),
                'nric' => $request->input('nric'),
                'is_approved' => true,
                'email' => $request->input('email'),
                'password' => Hash::make('password'),
            ]);
        }
        
        // Role
        $user->assignRole($request->input('role'));

        // insert into UserProfile
        $profile = $request->merge(['user_id' => $user->id]);
        return UserProfile::create($profile->except(['email','password','name','nric']));
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
        if ($request->has('role')) {
            // if change role
            $user->syncRoles($request->input('role'));
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

        // NRIC
        if ($request->has('nric')) {
            // if change role
                User::where('id', $user->id)->update($request->only(['nric']));
        }

        // User Profile
        return UserProfile::where('user_id', $user->id)->update($request->except(['email', 'password','_method','role','user_id']));

    }

    public static function show($user){
        // User, Profile
        $user = User::where('id',$user->id)->with(['profile.userDepartment'])->first();

        // Role

        //\Log::info($user);
        $user['role'] = $user->roles->pluck('name')[0];

        return $user;
    }

    public static function index()
    {
        $users = array();
        if(\Request::has('role')){
            //\Log::info('role');
       
            $role = \Request::query('role');       
            $paginate = User::query()
                            ->with('profile.userDepartment')
                            ->with('roles')
                            ->whereHas('roles', function($q) use ($role) {
                                $q->whereIn('name', [$role]);
                            })  
                            ->where('is_approved', true);
            $users = $paginate->orderBy('id','DESC')->paginate(25)->withQueryString();
        }

        if(\Request::has('is_approved')){
            //\Log::info('is_approved');
       
            $role = 'user';       
            $paginate = User::query()
                            ->with('profile.userDepartment')
                            ->with('roles')
                            ->whereHas('roles', function($q) use ($role) {
                                $q->whereIn('name', [$role]);
                            })
                            ->where('is_approved', false);
            $users = $paginate->orderBy('id','DESC')->paginate(25)->withQueryString();
        }
        
       
        return $users;
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
