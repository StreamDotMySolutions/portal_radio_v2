<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\UserService;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Models\User;

class UserController extends Controller
{
    public function index()
    {
        $users = UserService::index();
        return response()->json(['users' => $users]);
    }

    public function store(StoreUserRequest $request)
    {
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

    public function update(UpdateUserRequest $request, User $user)
    {
        UserService::update($request, $user);
        return response()->json(['message' => 'User successfully updated']);
    }

    public function delete(User $user)
    {
        UserService::delete($user);
        return response()->json(['message' => 'User successfully deleted']);
    }

}
