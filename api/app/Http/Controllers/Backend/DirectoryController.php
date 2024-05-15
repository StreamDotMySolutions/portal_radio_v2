<?php

namespace App\Http\Controllers\Backend;

use Illuminate\Http\Request;


class AccountController extends Controller
{
    public function store(Request $request)
    {
        \Log::info($request);
        return response()->json(['message' => 'Payload received']);
    }

}
