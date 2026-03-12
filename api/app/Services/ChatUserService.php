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

        if ($request->filled('full_name')) {
            $chatUser->full_name = $request->input('full_name');
        }

        if ($request->filled('gender')) {
            $chatUser->gender = $request->input('gender');
        }

        if ($request->filled('location')) {
            $chatUser->location = $request->input('location');
        }

        if ($request->filled('hobby')) {
            $chatUser->hobby = $request->input('hobby');
        }

        if ($request->filled('about_me')) {
            $chatUser->about_me = $request->input('about_me');
        }

        if ($request->hasFile('avatar')) {
            if ($chatUser->avatar_filename) {
                CommonService::handleDeleteFile($chatUser->avatar_filename, 'chat-avatars');
            }
            $chatUser->avatar_filename = CommonService::handleStoreFile($request->file('avatar'), 'chat-avatars');
        }

        if ($request->filled('facebook_url')) {
            $chatUser->facebook_url = $request->input('facebook_url');
        }

        if ($request->filled('instagram_url')) {
            $chatUser->instagram_url = $request->input('instagram_url');
        }

        if ($request->filled('twitter_url')) {
            $chatUser->twitter_url = $request->input('twitter_url');
        }

        if ($request->filled('tiktok_url')) {
            $chatUser->tiktok_url = $request->input('tiktok_url');
        }

        if ($request->filled('youtube_url')) {
            $chatUser->youtube_url = $request->input('youtube_url');
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
