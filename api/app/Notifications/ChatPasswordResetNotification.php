<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ChatPasswordResetNotification extends Notification
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
            ->subject('Set Semula Kata Laluan Sembang - Portal Radio')
            ->greeting('Assalamualaikum ' . $notifiable->username . ',')
            ->line('Anda menerima emel ini kerana kami menerima permintaan untuk set semula kata laluan akaun sembang anda.')
            ->action('Set Semula Kata Laluan', $this->url)
            ->line('Pautan ini akan tamat tempoh dalam 60 minit.')
            ->line('Jika anda tidak meminta set semula kata laluan, tiada tindakan lanjut diperlukan.')
            ->salutation('Terima kasih, Portal Radio');
    }
}
