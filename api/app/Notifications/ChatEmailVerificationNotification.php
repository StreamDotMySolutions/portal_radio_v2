<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ChatEmailVerificationNotification extends Notification
{
    use Queueable;

    public function __construct(private string $url)
    {
    }

    public function via($notifiable): array
    {
        return ['mail'];
    }

    public function toMail($notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Pengaktifan Akaun Sembang - Portal Radio')
            ->greeting('Assalamualaikum ' . $notifiable->username . ',')
            ->line('Sila klik butang di bawah untuk mengaktifkan akaun sembang anda.')
            ->action('Aktifkan Akaun', $this->url)
            ->line('Pautan ini akan tamat tempoh dalam 60 minit.')
            ->line('Jika anda tidak mendaftar akaun sembang, tiada tindakan lanjut diperlukan.')
            ->salutation('Terima kasih, Portal Radio');
    }
}
