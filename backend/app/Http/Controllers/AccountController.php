<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Services\AccountService;
use App\Http\Requests\UpdateAccountRequest;

class AccountController extends Controller
{
    public function show()
    {
        $account = AccountService::show();

        return response()->json(['account' => $account]);
    }

    public function update(UpdateAccountRequest $request)
    {
   
        AccountService::update($request);

        return response()->json(['message' => "User successfull updated"]);
    }
}
