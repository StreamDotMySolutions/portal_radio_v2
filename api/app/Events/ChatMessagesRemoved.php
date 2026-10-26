<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;

class ChatMessagesRemoved implements ShouldBroadcastNow
{
    /**
     * @param int[] $ids Removed message ids (ignored when $all is true)
     * @param bool $all Every message was cleared
     */
    public function __construct(public array $ids = [], public bool $all = false)
    {
    }

    public function broadcastOn(): Channel
    {
        return new Channel('chat');
    }

    public function broadcastAs(): string
    {
        return 'messages.removed';
    }

    public function broadcastWith(): array
    {
        return ['ids' => array_values($this->ids), 'all' => $this->all];
    }
}
