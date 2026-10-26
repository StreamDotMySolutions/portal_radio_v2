<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;

class ChatUserUpdated implements ShouldBroadcastNow
{
    public function __construct(public int $chatUserId, public bool $isBanned)
    {
    }

    public function broadcastOn(): Channel
    {
        return new Channel('chat');
    }

    public function broadcastAs(): string
    {
        return 'user.updated';
    }

    public function broadcastWith(): array
    {
        return ['chat_user_id' => $this->chatUserId, 'is_banned' => $this->isBanned];
    }
}
