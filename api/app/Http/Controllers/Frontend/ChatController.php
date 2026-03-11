<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Services\ChatService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;

class ChatController extends Controller
{
    public function __construct(private ChatService $chatService)
    {
    }

    public function register(Request $request)
    {
        $validated = $request->validate([
            'username' => ['required', 'string', 'min:2', 'max:30', 'regex:/^[a-zA-Z0-9_]+$/', 'unique:chat_users,username'],
            'email' => ['required', 'email', 'unique:chat_users,email'],
            'password' => ['required', 'string', 'min:6'],
        ], [
            'username.regex' => 'Username hanya boleh mengandungi huruf, nombor dan underscore.',
            'username.unique' => 'Username sudah digunakan.',
            'email.unique' => 'Email sudah didaftarkan.',
            'password.min' => 'Kata laluan mestilah sekurang-kurangnya 6 aksara.',
        ]);

        $user = $this->chatService->register($validated['username'], $validated['email'], $validated['password']);

        return response()->json([
            'user' => [
                'id' => $user->id,
                'username' => $user->username,
                'color' => $user->color,
                'token' => $user->token,
            ],
        ], 201);
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

        return response()->json([
            'user' => [
                'id' => $user->id,
                'username' => $user->username,
                'color' => $user->color,
                'token' => $user->token,
            ],
        ]);
    }

    public function index(Request $request)
    {
        $afterId = $request->integer('after') ?: null;
        $limit = $request->integer('limit', 50);

        $messages = $this->chatService->getMessages($afterId, $limit);

        return response()->json(['messages' => $messages]);
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
        ]);

        $token = $request->header('X-Chat-Token');

        if (!$token) {
            return response()->json(['message' => 'Token diperlukan.'], 401);
        }

        $result = $this->chatService->sendMessage($token, $request->message);

        if (!$result) {
            return response()->json(['message' => 'Token tidak sah.'], 401);
        }

        if (isset($result['error']) && $result['error'] === 'banned') {
            return response()->json(['message' => 'Akaun anda telah disekat.'], 403);
        }

        return response()->json(['message' => $result], 201);
    }
}
