<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\UserProfile;
use App\Models\UserDepartment;

use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class UserSeeder extends Seeder
{
    public function run()
    {
        // Roles
        Role::create(['name' => 'admin']);
        Role::create(['name' => 'user']);

        // admin ########################################### start
        $user = User::create([
            'name' => 'Administrator',
            'email' => 'admin@local',
            'password' => Hash::make('password'),
        ]);

        UserProfile::create([
            'address' => 'Malaysia',
            'user_id' => $user->id,
        ]);

        $user->assignRole('admin');
        unset($user);
        // admin ########################################### end


        // user ########################################### start
        $user = User::create([
            'name' => 'User',
            'email' => 'user@local',
            'password' => Hash::make('password'),
        ]);

        UserProfile::create([
            'user_id' => $user->id,
            'address' => 'Malaysia',

        ]);
        $user->assignRole('user');
        unset($user);
        // user ########################################### end
    }
}
