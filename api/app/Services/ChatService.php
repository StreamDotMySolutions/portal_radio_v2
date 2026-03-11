<?php

namespace App\Services;

use App\Models\ChatUser;
use App\Models\ChatMessage;
use Illuminate\Support\Facades\Hash;

class ChatService
{
    private const PROFILE_FIELDS = [
        'full_name', 'gender', 'location', 'hobby', 'about_me',
        'facebook_url', 'instagram_url', 'twitter_url', 'tiktok_url', 'youtube_url',
    ];

    private const COLORS = [
        '#3F3F8F', '#DC2626', '#059669', '#D97706', '#7C3AED',
        '#BE185D', '#0284C7', '#EA580C', '#F97316', '#6366F1',
        '#EC4899', '#14B8A6', '#8B5CF6', '#F59E0B', '#06B6D4',
        '#EF4444', '#10B981', '#3B82F6', '#D946EF', '#FB923C',
    ];

    public function register(string $username, string $email, string $password): ChatUser
    {
        $user = ChatUser::create([
            'username' => $username,
            'email' => $email,
            'password' => Hash::make($password),
            'token' => bin2hex(random_bytes(32)),
            'color' => self::COLORS[ChatUser::count() % count(self::COLORS)],
        ]);

        return $user;
    }

    public function login(string $username, string $password): ?ChatUser
    {
        $user = ChatUser::where('username', $username)->first();

        if (!$user || !Hash::check($password, $user->password)) {
            return null;
        }

        return $user;
    }

    public function getMessages(?int $afterId = null, int $limit = 50): array
    {
        $limit = min($limit, 100);

        $query = ChatMessage::with('chatUser')
            ->orderBy('id', 'asc');

        if ($afterId) {
            $query->where('id', '>', $afterId);
        } else {
            $query->orderBy('id', 'desc')->limit($limit);
        }

        $messages = $afterId
            ? $query->limit($limit)->get()
            : $query->get()->reverse()->values();

        return $messages->map(function (ChatMessage $msg) {
            return [
                'id' => $msg->id,
                'chat_user_id' => $msg->chatUser->id,
                'username' => $msg->chatUser->username,
                'color' => $msg->chatUser->color,
                'avatar_filename' => $msg->chatUser->avatar_filename,
                'message' => $msg->message,
                'created_at' => $msg->created_at->format('H:i'),
            ];
        })->toArray();
    }

    public function sendMessage(string $token, string $text): ?array
    {
        $user = ChatUser::where('token', $token)->first();

        if (!$user) {
            return null;
        }

        if ($user->is_banned) {
            return ['error' => 'banned'];
        }

        $message = $user->messages()->create([
            'message' => strip_tags(mb_substr(trim($text), 0, 500)),
        ]);

        return [
            'id' => $message->id,
            'chat_user_id' => $user->id,
            'username' => $user->username,
            'color' => $user->color,
            'avatar_filename' => $user->avatar_filename,
            'message' => $message->message,
            'created_at' => $message->created_at->format('H:i'),
        ];
    }

    public function sendActivationLink(string $token): ?string
    {
        $user = ChatUser::where('token', $token)->first();

        if (!$user) {
            return null;
        }

        if ($user->isVerified()) {
            return 'already_verified';
        }

        $user->sendEmailVerificationNotification();

        return 'sent';
    }

    public function verifyEmail(int $id, string $hash): ?ChatUser
    {
        $user = ChatUser::find($id);

        if (!$user || sha1($user->email) !== $hash) {
            return null;
        }

        if (!$user->isVerified()) {
            $user->email_verified_at = now();
            $user->save();
        }

        return $user;
    }

    public function getProfile(string $token): ?ChatUser
    {
        return ChatUser::where('token', $token)->first();
    }

    public function updateProfile(string $token, array $data, $avatar = null): array
    {
        $user = ChatUser::where('token', $token)->first();

        if (!$user) {
            return ['error' => 'unauthorized'];
        }

        if (!$user->isVerified()) {
            return ['error' => 'unverified'];
        }

        $user->fill(collect($data)->only(self::PROFILE_FIELDS)->toArray());

        if ($avatar) {
            if ($user->avatar_filename) {
                CommonService::handleDeleteFile($user->avatar_filename, 'chat-avatars');
            }
            $user->avatar_filename = CommonService::handleStoreFile($avatar, 'chat-avatars');
        }

        $user->save();

        return ['user' => $user];
    }

    public function removeAvatar(string $token): ?ChatUser
    {
        $user = ChatUser::where('token', $token)->first();

        if (!$user) {
            return null;
        }

        if ($user->avatar_filename) {
            CommonService::handleDeleteFile($user->avatar_filename, 'chat-avatars');
            $user->avatar_filename = null;
            $user->save();
        }

        return $user;
    }

    public function getPublicProfile(int $userId): ?array
    {
        $user = ChatUser::find($userId);

        if (!$user) {
            return null;
        }

        return [
            'id' => $user->id,
            'username' => $user->username,
            'color' => $user->color,
            'avatar_filename' => $user->avatar_filename,
            'full_name' => $user->full_name,
            'gender' => $user->gender,
            'location' => $user->location,
            'hobby' => $user->hobby,
            'about_me' => $user->about_me,
            'facebook_url' => $user->facebook_url,
            'instagram_url' => $user->instagram_url,
            'twitter_url' => $user->twitter_url,
            'tiktok_url' => $user->tiktok_url,
            'youtube_url' => $user->youtube_url,
            'created_at' => $user->created_at,
        ];
    }
}
