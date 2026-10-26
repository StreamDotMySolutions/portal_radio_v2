<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\ChatUser;
use App\Services\ChatService;
use Illuminate\Contracts\Encryption\DecryptException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;

class ChatController extends Controller
{
    private const USERNAME_RULES = ['required', 'string', 'min:2', 'max:30', 'regex:/^[a-zA-Z0-9_]+$/', 'unique:chat_users,username'];

    private const USERNAME_MESSAGES = [
        'username.regex' => 'Username hanya boleh mengandungi huruf, nombor dan underscore.',
        'username.unique' => 'Username sudah digunakan.',
    ];

    public function __construct(private ChatService $chatService)
    {
    }

    public function register(Request $request)
    {
        $validated = $request->validate([
            'username' => self::USERNAME_RULES,
            'email' => ['required', 'email', 'unique:chat_users,email'],
            'password' => ['required', 'string', 'min:6'],
        ], self::USERNAME_MESSAGES + [
            'email.unique' => 'Email sudah didaftarkan.',
            'password.min' => 'Kata laluan mestilah sekurang-kurangnya 6 aksara.',
        ]);

        $user = $this->chatService->register($validated['username'], $validated['email'], $validated['password']);

        return response()->json(['user' => $this->userPayload($user)], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'username' => ['required', 'string'],
            'password' => ['required', 'string'],
        ]);

        $user = $this->chatService->login($request->username, $request->password);

        if (!$user) {
            return response()->json(['message' => 'Username atau kata laluan tidak sah.'], 401);
        }

        return response()->json(['user' => $this->userPayload($user)]);
    }

    /**
     * Google sign-in. Logs in an existing account (matched by Google id or email), or returns
     * a short-lived signup token so a new user can pick a username first.
     */
    public function google(Request $request)
    {
        $request->validate(['credential' => ['required', 'string', 'max:4096']]);

        if (!config('services.google.client_id')) {
            return response()->json(['message' => 'Log masuk Google tidak tersedia.'], 503);
        }

        $claims = $this->chatService->verifyGoogleToken($request->credential);

        if (!$claims) {
            return response()->json(['message' => 'Log masuk Google gagal. Sila cuba lagi.'], 401);
        }

        $user = $this->chatService->loginWithGoogle($claims);

        if ($user) {
            return response()->json(['user' => $this->userPayload($user)]);
        }

        return response()->json([
            'needs_username' => true,
            'suggested_username' => $this->chatService->suggestUsername($claims['email']),
            'signup_token' => Crypt::encryptString(json_encode([
                'sub' => $claims['sub'],
                'email' => $claims['email'],
                'exp' => now()->addMinutes(15)->timestamp,
            ])),
        ]);
    }

    /** Second step of Google sign-in for a new user: create the account with the chosen username */
    public function googleComplete(Request $request)
    {
        $request->validate([
            'signup_token' => ['required', 'string'],
            'username' => self::USERNAME_RULES,
        ], self::USERNAME_MESSAGES);

        try {
            $claims = json_decode(Crypt::decryptString($request->signup_token), true);
        } catch (DecryptException $e) {
            $claims = null;
        }

        if (!is_array($claims) || ($claims['exp'] ?? 0) < time()) {
            return response()->json(['message' => 'Sesi Google telah tamat. Sila log masuk dengan Google semula.'], 422);
        }

        // The email or Google id may have been registered since the first step
        $user = $this->chatService->loginWithGoogle($claims)
            ?? $this->chatService->registerWithGoogle($claims, $request->username);

        return response()->json(['user' => $this->userPayload($user)], 201);
    }

    private function userPayload(ChatUser $user): array
    {
        return [
            'id' => $user->id,
            'username' => $user->username,
            'color' => $user->color,
            'token' => $user->token,
            'email_verified_at' => $user->email_verified_at,
            'avatar_filename' => $user->avatar_filename,
            'is_banned' => $user->is_banned,
        ];
    }

    public function index(Request $request)
    {
        $afterId = $request->integer('after') ?: null;
        $beforeId = $request->integer('before') ?: null;
        $limit = $request->integer('limit', 50);

        $messages = $this->chatService->getMessages($afterId, $beforeId, $limit);

        $response = ['messages' => $messages];

        // has_more tells the client whether older history can be loaded
        if (!$afterId) {
            $response['has_more'] = count($messages) > 0
                && $this->chatService->hasMessagesBefore($messages[0]['id']);
        }

        return response()->json($response);
    }

    public function forgotPassword(Request $request)
    {
        $request->validate([
            'email' => ['required', 'email'],
        ]);

        $status = Password::broker('chat_users')->sendResetLink(
            $request->only('email')
        );

        if ($status === Password::RESET_LINK_SENT) {
            return response()->json(['message' => 'Pautan set semula kata laluan telah dihantar ke emel anda.']);
        }

        if ($status === Password::RESET_THROTTLED) {
            return response()->json(['message' => 'Sila tunggu sebentar sebelum meminta pautan baru.'], 429);
        }

        return response()->json(['message' => 'Emel tidak ditemui.'], 404);
    }

    public function resetPassword(Request $request)
    {
        $request->validate([
            'token' => ['required', 'string'],
            'email' => ['required', 'email'],
            'password' => ['required', 'string', 'min:6', 'confirmed'],
        ], [
            'password.min' => 'Kata laluan mestilah sekurang-kurangnya 6 aksara.',
            'password.confirmed' => 'Pengesahan kata laluan tidak sepadan.',
        ]);

        $status = Password::broker('chat_users')->reset(
            $request->only('email', 'token', 'password', 'password_confirmation'),
            function ($user, $password) {
                $user->password = Hash::make($password);
                $user->save();
            }
        );

        if ($status === Password::PASSWORD_RESET) {
            return response()->json(['message' => 'Kata laluan berjaya ditukar. Sila log masuk semula.']);
        }

        if ($status === Password::INVALID_TOKEN) {
            return response()->json(['message' => 'Pautan tidak sah atau telah tamat tempoh.'], 422);
        }

        return response()->json(['message' => 'Gagal menukar kata laluan.'], 422);
    }

    public function store(Request $request)
    {
        $request->validate([
            'message' => ['required', 'string', 'min:1', 'max:500'],
            'client_id' => ['nullable', 'string', 'max:64'],
        ]);

        $token = $request->header('X-Chat-Token');

        if (!$token) {
            return response()->json(['message' => 'Token diperlukan.'], 401);
        }

        $result = $this->chatService->sendMessage($token, $request->message, $request->input('client_id'));

        if (!$result) {
            return response()->json(['message' => 'Token tidak sah.'], 401);
        }

        if (isset($result['error']) && $result['error'] === 'banned') {
            return response()->json(['message' => 'Akaun anda telah disekat.'], 403);
        }

        return response()->json(['message' => $result], 201);
    }

    public function sendActivation(Request $request)
    {
        $token = $request->header('X-Chat-Token');

        if (!$token) {
            return response()->json(['message' => 'Token diperlukan.'], 401);
        }

        $result = $this->chatService->sendActivationLink($token);

        if ($result === null) {
            return response()->json(['message' => 'Token tidak sah.'], 401);
        }

        if ($result === 'already_verified') {
            return response()->json(['message' => 'Akaun sudah diaktifkan.']);
        }

        return response()->json(['message' => 'Pautan pengaktifan telah dihantar ke emel anda.']);
    }

    public function verifyEmail(Request $request, int $id, string $hash)
    {
        if (!$request->hasValidSignature()) {
            $frontendUrl = rtrim(env('FRONTEND_URL', 'http://localhost:3000'), '/');
            return redirect($frontendUrl . '/chat?verify_error=1');
        }

        $user = $this->chatService->verifyEmail($id, $hash);

        if (!$user) {
            $frontendUrl = rtrim(env('FRONTEND_URL', 'http://localhost:3000'), '/');
            return redirect($frontendUrl . '/chat?verify_error=1');
        }

        $frontendUrl = rtrim(env('FRONTEND_URL', 'http://localhost:3000'), '/');
        return redirect($frontendUrl . '/chat?verified=1');
    }

    public function profile(Request $request)
    {
        $token = $request->header('X-Chat-Token');

        if (!$token) {
            return response()->json(['message' => 'Token diperlukan.'], 401);
        }

        $user = $this->chatService->getProfile($token);

        if (!$user) {
            return response()->json(['message' => 'Token tidak sah.'], 401);
        }

        return response()->json([
            'user' => [
                'id' => $user->id,
                'username' => $user->username,
                'email' => $user->email,
                'color' => $user->color,
                'email_verified_at' => $user->email_verified_at,
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
            ],
        ]);
    }

    public function updateProfile(Request $request)
    {
        $token = $request->header('X-Chat-Token');

        if (!$token) {
            return response()->json(['message' => 'Token diperlukan.'], 401);
        }

        $request->validate([
            'full_name' => ['nullable', 'string', 'max:100'],
            'gender' => ['nullable', 'in:lelaki,perempuan'],
            'location' => ['nullable', 'string', 'max:100'],
            'hobby' => ['nullable', 'string', 'max:255'],
            'about_me' => ['nullable', 'string', 'max:1000'],
            'avatar' => ['nullable', 'image', 'mimes:png,jpg,jpeg', 'max:5120'],
            'facebook_url' => ['nullable', 'string', 'max:255'],
            'instagram_url' => ['nullable', 'string', 'max:255'],
            'twitter_url' => ['nullable', 'string', 'max:255'],
            'tiktok_url' => ['nullable', 'string', 'max:255'],
            'youtube_url' => ['nullable', 'string', 'max:255'],
        ]);

        $result = $this->chatService->updateProfile(
            $token,
            $request->only([
                'full_name', 'gender', 'location', 'hobby', 'about_me',
                'facebook_url', 'instagram_url', 'twitter_url', 'tiktok_url', 'youtube_url',
            ]),
            $request->file('avatar')
        );

        if (isset($result['error'])) {
            if ($result['error'] === 'unauthorized') {
                return response()->json(['message' => 'Token tidak sah.'], 401);
            }
            if ($result['error'] === 'unverified') {
                return response()->json(['message' => 'Sila aktifkan akaun anda terlebih dahulu.'], 403);
            }
        }

        $user = $result['user'];

        return response()->json([
            'message' => 'Profil berjaya dikemaskini.',
            'user' => [
                'id' => $user->id,
                'username' => $user->username,
                'color' => $user->color,
                'email_verified_at' => $user->email_verified_at,
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
            ],
        ]);
    }

    public function removeAvatar(Request $request)
    {
        $token = $request->header('X-Chat-Token');

        if (!$token) {
            return response()->json(['message' => 'Token diperlukan.'], 401);
        }

        $user = $this->chatService->removeAvatar($token);

        if (!$user) {
            return response()->json(['message' => 'Token tidak sah.'], 401);
        }

        return response()->json(['message' => 'Avatar berjaya dipadam.']);
    }

    public function publicProfile(int $userId)
    {
        $profile = $this->chatService->getPublicProfile($userId);

        if (!$profile) {
            return response()->json(['message' => 'Pengguna tidak ditemui.'], 404);
        }

        return response()->json(['user' => $profile]);
    }
}
