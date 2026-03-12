<?php

namespace App\Http\Controllers\Backend;

use App\Models\ChatUser;
use App\Services\ChatUserService;
use Illuminate\Http\Request;

class ChatUserController extends Controller
{
    public function index(Request $request)
    {
        $chatUsers = ChatUserService::index($request);
        return response()->json(['chat_users' => $chatUsers]);
    }

    public function show(ChatUser $chatUser)
    {
        return response()->json(['chat_user' => $chatUser->makeVisible(['email'])]);
    }

    public function update(Request $request, ChatUser $chatUser)
    {
        $request->validate([
            'username' => ['sometimes', 'string', 'min:2', 'max:30', 'regex:/^[a-zA-Z0-9_]+$/', 'unique:chat_users,username,' . $chatUser->id],
            'email' => ['sometimes', 'email', 'unique:chat_users,email,' . $chatUser->id],
            'password' => ['nullable', 'string', 'min:6', 'confirmed'],
        ]);

        ChatUserService::update($request, $chatUser);
        return response()->json(['message' => 'Chat user successfully updated']);
    }

    public function delete(ChatUser $chatUser)
    {
        ChatUserService::delete($chatUser);
        return response()->json(['message' => 'Chat user successfully deleted']);
    }

    public function toggleBan(ChatUser $chatUser)
    {
        $chatUser->is_banned = !$chatUser->is_banned;
        $chatUser->save();

        $status = $chatUser->is_banned ? 'banned' : 'unbanned';
        return response()->json(['message' => "Chat user successfully {$status}"]);
    }

    public function verify(ChatUser $chatUser)
    {
        if ($chatUser->isVerified()) {
            return response()->json(['message' => 'User akaun sudah diverifikasi.']);
        }

        $chatUser->email_verified_at = now();
        $chatUser->save();

        return response()->json(['message' => 'Chat user akaun berjaya diverifikasi.']);
    }
}
