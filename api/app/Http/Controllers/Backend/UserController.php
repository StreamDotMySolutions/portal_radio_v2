<?php
namespace App\Http\Controllers\Backend;

use Illuminate\Http\Request;
use App\Services\UserService;
use App\Http\Requests\Users\StoreRequest;
use App\Http\Requests\Users\UpdateRequest;
use App\Http\Requests\Users\DeleteRequest;
use App\Models\User;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    public function index()
    {
        $users = UserService::index();
        return response()->json(['users' => $users]);
    }

    public function roles()
    {
        $roles = Role::all();
        return response()->json(['roles' => $roles]);
    }

    public function store(StoreRequest $request)
    {
        //\Log::info($request);
        UserService::store($request);
        return response()->json(['message' => 'User successfully created']);
    }

    public function approve(User $user)
    {
        $user = UserService::approve($user);
        return response()->json(['message' => 'User successfully approved']);
    }

    public function disable(User $user)
    {
        $user = UserService::disable($user);
        return response()->json(['message' => 'User successfully disabled']);
    }


    public function show(User $user)
    {
        $user = UserService::show($user);
        return response()->json(['user' => $user]);
    }

    public function update(UpdateRequest $request, User $user)
    {
        //\Log::info($request);
        UserService::update($request, $user);
        return response()->json(['message' => 'User successfully updated']);
    }

    public function delete(DeleteRequest $request, User $user)
    {
        UserService::delete($user);
        return response()->json(['message' => 'User successfully deleted']);
    }

}
