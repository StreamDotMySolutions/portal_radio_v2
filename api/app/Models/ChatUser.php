<?php

namespace App\Models;

use Illuminate\Auth\Passwords\CanResetPassword;
use Illuminate\Contracts\Auth\CanResetPassword as CanResetPasswordContract;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;

class ChatUser extends Model implements CanResetPasswordContract
{
    use CanResetPassword, Notifiable;

    protected $guarded = ['id'];

    protected $casts = [
        'is_banned' => 'boolean',
        'created_at' => 'datetime:d/m/Y H:i',
        'updated_at' => 'datetime:d/m/Y H:i',
    ];

    protected $hidden = ['token', 'email', 'password'];

    public function messages()
    {
        return $this->hasMany(ChatMessage::class);
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
