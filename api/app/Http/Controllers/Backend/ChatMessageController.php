<?php

namespace App\Http\Controllers\Backend;

use App\Events\ChatMessagesRemoved;
use App\Models\ChatMessage;
use App\Services\ChatService;
use Illuminate\Http\Request;

class ChatMessageController extends Controller
{
    public function index(Request $request)
    {
        $query = ChatMessage::with('chatUser')
            ->orderBy('id', 'desc');

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('message', 'like', "%{$search}%")
                  ->orWhereHas('chatUser', fn($u) => $u->where('username', 'like', "%{$search}%"));
            });
        }

        $messages = $query->paginate(50)->withQueryString();

        $messages->through(function ($msg) {
            return [
                'id' => $msg->id,
                'username' => $msg->chatUser->username ?? '[deleted]',
                'color' => $msg->chatUser->color ?? '#999',
                'message' => $msg->message,
                'created_at' => $msg->created_at->format('d/m/Y H:i'),
            ];
        });

        return response()->json(['messages' => $messages]);
    }

    public function destroy(ChatMessage $chatMessage)
    {
        $id = $chatMessage->id;
        $chatMessage->delete();
        ChatService::broadcast(new ChatMessagesRemoved([$id]));
        return response()->json(['message' => 'Message deleted']);
    }

    public function clear()
    {
        $count = ChatMessage::count();
        ChatMessage::truncate();
        ChatService::broadcast(new ChatMessagesRemoved([], true));
        return response()->json(['message' => "{$count} messages cleared"]);
    }
}
