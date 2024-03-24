<?php

namespace App\Http\Controllers;
use Spatie\Permission\Models\Role;
use Illuminate\Http\Request;
use App\Services\RoleService;
use App\Http\Requests\Roles\StoreRequest;
use App\Http\Requests\Roles\UpdateRequest;
use App\Http\Requests\Roles\DeleteRequest;

class RoleController extends Controller
{
    public function index()
    {
        $roles = RoleService::index();
        return response()->json(['roles' => $roles]);
    }

    public function store(StoreRequest $request)
    {
        //\Log::info($request);
        RoleService::store($request);
        return response()->json(['message' => 'Role successfully created']);
    }

    public function show(Role $role)
    {
        $role = RoleService::show($role);
        return response()->json(['role' => $role]);
    }

    public function update(UpdateRequest $request, Role $role)
    {
        //\Log::info('update');
        RoleService::update($request, $role);
        return response()->json(['message' => 'Role successfully updated']);
    }

    public function delete(Role $role)
    {
        RoleService::delete($role);
        return response()->json(['message' => 'Role successfully deleted']);
    }
}
