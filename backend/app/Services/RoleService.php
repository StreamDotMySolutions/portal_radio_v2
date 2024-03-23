<?php
namespace App\Services;

use App\Models\Role;
use Illuminate\Http\Request;

class RoleService
{

    public static function store(Request $request)
    {
        $role = Role::create([
            'name' => $request->input('name'),
        ]);
        return $role;
    }

    public static function update(Request $request, $role)
    {
        // Role update
        return Role::where('id', $role->id)->update($request->except(['_method','id']));
    }

    public static function show($role)
    {
        // Role
        $role = Role::where('id',$role->id)->first();
        return $role;
    }

    public static function index()
    {
        $paginate = Role::query();
        $roles = $paginate->orderBy('id','DESC')->paginate(25)->withQueryString();     
        return $roles;
    }

    public static function delete($role)
    {
        // Delete the role
        $role->delete();
    }
}
