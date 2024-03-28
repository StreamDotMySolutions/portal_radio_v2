<?php
namespace App\Services;

// use App\Models\Role;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RoleService
{

    public static function index()
    {
        $paginate = Role::query();
        $roles = $paginate->orderBy('id','DESC')->paginate(10)->withQueryString();     
        return $roles;
    }

    public static function store(Request $request)
    {
        // $role = Role::create([
        //     'name' => $request->input('name'),
        // ]);

        
        $role = Role::create([
            'name' => $request->input('name') ,
            'guard_name' => 'web'
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

    public static function delete($role)
    {
        $r = \App\Models\Role::findorFail($role->id);
        $r->delete();
    }
}
