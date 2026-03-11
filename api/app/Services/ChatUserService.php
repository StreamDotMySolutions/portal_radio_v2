<?php

namespace App\Services;

use App\Models\ChatUser;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class ChatUserService
{
    public static function index(Request $request)
    {
        $query = ChatUser::query()->withCount('messages');

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('username', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        return $query->orderBy('id', 'DESC')->paginate(25)->withQueryString()
            ->through(function ($user) {
                return [
                    'id' => $user->id,
                    'username' => $user->username,
                    'email' => $user->email,
                    'color' => $user->color,
                    'is_banned' => $user->is_banned,
                    'email_verified_at' => $user->email_verified_at?->format('d/m/Y H:i'),
                    'avatar_filename' => $user->avatar_filename,
                    'messages_count' => $user->messages_count,
                    'created_at' => $user->created_at->format('d/m/Y H:i'),
                ];
            });
    }

    public static function update(Request $request, ChatUser $chatUser)
    {
        if ($request->filled('username')) {
            $chatUser->username = $request->input('username');
        }

        if ($request->filled('email')) {
            $chatUser->email = $request->input('email');
        }

        if ($request->filled('password')) {
            $chatUser->password = Hash::make($request->input('password'));
        }

        $chatUser->save();
    }

    public static function delete(ChatUser $chatUser)
    {
        // Delete messages first
        $chatUser->messages()->delete();

        // Delete avatar file if exists
        if ($chatUser->avatar_filename) {
            CommonService::handleDeleteFile($chatUser->avatar_filename, 'chat-avatars');
        }

        $chatUser->delete();
    }
}
