<?php

namespace App\Services;

use App\Events\ChatMessageSent;
use App\Models\ChatUser;
use App\Models\ChatMessage;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

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

    public function getMessages(?int $afterId = null, ?int $beforeId = null, int $limit = 50): array
    {
        $limit = max(1, min($limit, 100));

        $query = ChatMessage::with('chatUser');

        if ($afterId) {
            // Polling: messages newer than the client's last id, oldest first
            $messages = $query->where('id', '>', $afterId)
                ->orderBy('id')
                ->limit($limit)
                ->get();
        } else {
            // Initial load (newest page) or history (page older than $beforeId)
            if ($beforeId) {
                $query->where('id', '<', $beforeId);
            }

            $messages = $query->orderByDesc('id')
                ->limit($limit)
                ->get()
                ->reverse()
                ->values();
        }

        return $messages->map(fn (ChatMessage $msg) => $this->formatMessage($msg))->toArray();
    }

    public function hasMessagesBefore(int $id): bool
    {
        return ChatMessage::where('id', '<', $id)->exists();
    }

    public function sendMessage(string $token, string $text, ?string $clientId = null): ?array
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
        $message->setRelation('chatUser', $user);

        $payload = $this->formatMessage($message);

        // client_id lets the sender's own widget replace its optimistic copy,
        // whether the broadcast or the HTTP response arrives first
        if ($clientId !== null) {
            $payload['client_id'] = $clientId;
        }

        self::broadcast(new ChatMessageSent($payload));

        return $payload;
    }

    /**
     * Push a chat event to WebSocket clients. Failures are logged, never thrown:
     * clients fall back to polling, so a Reverb outage must not break the request.
     */
    public static function broadcast(object $event): void
    {
        try {
            broadcast($event);
        } catch (\Throwable $e) {
            Log::warning('Chat broadcast failed: ' . $e->getMessage());
        }
    }

    public function formatMessage(ChatMessage $msg): array
    {
        return [
            'id' => $msg->id,
            'chat_user_id' => $msg->chat_user_id,
            'username' => $msg->chatUser?->username ?? '[dipadam]',
            'color' => $msg->chatUser?->color ?? '#999999',
            'avatar_filename' => $msg->chatUser?->avatar_filename,
            'message' => $msg->message,
            'created_at' => $msg->created_at->format('H:i'),
            'created_at_iso' => $msg->created_at->toIso8601String(),
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
