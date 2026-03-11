<?php

namespace App\Models;

use Illuminate\Auth\Passwords\CanResetPassword;
use Illuminate\Contracts\Auth\CanResetPassword as CanResetPasswordContract;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\URL;

class ChatUser extends Model implements CanResetPasswordContract
{
    use CanResetPassword, Notifiable;

    protected $guarded = ['id'];

    protected $casts = [
        'is_banned' => 'boolean',
        'email_verified_at' => 'datetime',
        'created_at' => 'datetime:d/m/Y H:i',
        'updated_at' => 'datetime:d/m/Y H:i',
    ];

    protected $hidden = ['token', 'email', 'password'];

    public function messages()
    {
        return $this->hasMany(ChatMessage::class);
    }

    public function isVerified(): bool
    {
        return $this->email_verified_at !== null;
    }

    public function sendEmailVerificationNotification(): void
    {
        $url = URL::temporarySignedRoute(
            'chat.verify-email',
            now()->addMinutes(60),
            ['id' => $this->id, 'hash' => sha1($this->email)]
        );

        $this->notify(new \App\Notifications\ChatEmailVerificationNotification($url));
    }

    public function sendPasswordResetNotification($token)
    {
        $frontendUrl = rtrim(env('FRONTEND_URL', 'http://localhost:3000'), '/');
        $url = $frontendUrl . '/chat/reset-password?' . http_build_query([
            'token' => $token,
            'email' => $this->email,
        ]);

        $this->notify(new \App\Notifications\ChatPasswordResetNotification($url));
    }
}
