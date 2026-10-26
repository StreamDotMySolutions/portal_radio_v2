<?php

use App\Events\ChatMessageSent;
use App\Events\ChatMessagesRemoved;
use App\Events\ChatUserUpdated;
use App\Models\ChatUser;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Event;
use Laravel\Sanctum\Sanctum;
use Spatie\Permission\Middleware\RoleMiddleware;

uses(RefreshDatabase::class);

function broadcastChatUser(string $username): ChatUser
{
    // Unique names: the clear-all test TRUNCATEs, which commits and escapes the test transaction
    $username .= '_' . substr(uniqid(), -6);

    return ChatUser::create([
        'username' => $username,
        'email' => "{$username}@example.test",
        'password' => bcrypt('secret123'),
        'token' => bin2hex(random_bytes(32)),
        'color' => '#3F3F8F',
    ]);
}

function actingAsChatAdmin($test): void
{
    Sanctum::actingAs(User::factory()->create(['password' => 'password']));
    $test->withoutMiddleware(RoleMiddleware::class);
}

it('broadcasts a sent message on the chat channel', function () {
    Event::fake([ChatMessageSent::class]);
    $user = broadcastChatUser('ali');

    $this->withHeader('X-Chat-Token', $user->token)
        ->postJson('/api/frontend/chat/messages', ['message' => 'Salam'])
        ->assertCreated();

    Event::assertDispatched(ChatMessageSent::class, function (ChatMessageSent $e) {
        return $e->message['message'] === 'Salam'
            && $e->broadcastOn()->name === 'chat'
            && $e->broadcastAs() === 'message.sent';
    });
});

it('still saves the message when the websocket server is unreachable', function () {
    config([
        'broadcasting.default' => 'reverb',
        'broadcasting.connections.reverb.key' => 'test-key',
        'broadcasting.connections.reverb.secret' => 'test-secret',
        'broadcasting.connections.reverb.app_id' => '1',
        'broadcasting.connections.reverb.options.host' => '127.0.0.1',
        'broadcasting.connections.reverb.options.port' => 1, // nothing listens here
        'broadcasting.connections.reverb.options.scheme' => 'http',
        'broadcasting.connections.reverb.options.useTLS' => false,
    ]);
    $user = broadcastChatUser('ali');

    $this->withHeader('X-Chat-Token', $user->token)
        ->postJson('/api/frontend/chat/messages', ['message' => 'Tetap sampai'])
        ->assertCreated();

    expect($user->messages()->where('message', 'Tetap sampai')->exists())->toBeTrue();
});

it('broadcasts removals when an admin deletes or clears messages', function () {
    Event::fake([ChatMessagesRemoved::class]);
    actingAsChatAdmin($this);
    $msg = broadcastChatUser('ali')->messages()->create(['message' => 'buang']);

    $this->deleteJson("/api/chat-messages/{$msg->id}")->assertOk();
    Event::assertDispatched(ChatMessagesRemoved::class, fn ($e) => $e->ids === [$msg->id] && !$e->all);

    $this->deleteJson('/api/chat-messages')->assertOk();
    Event::assertDispatched(ChatMessagesRemoved::class, fn ($e) => $e->all === true);
});

it('broadcasts the messages of a deleted chat user', function () {
    Event::fake([ChatMessagesRemoved::class]);
    actingAsChatAdmin($this);
    $user = broadcastChatUser('ali');
    $ids = collect([1, 2])->map(fn ($i) => $user->messages()->create(['message' => "m{$i}"])->id)->all();

    $this->deleteJson("/api/chat-users/{$user->id}")->assertOk();

    Event::assertDispatched(ChatMessagesRemoved::class, fn ($e) => $e->ids === $ids);
});

it('broadcasts ban changes', function () {
    Event::fake([ChatUserUpdated::class]);
    actingAsChatAdmin($this);
    $user = broadcastChatUser('ali');

    $this->patchJson("/api/chat-users/{$user->id}/toggle-ban")->assertOk();

    Event::assertDispatched(ChatUserUpdated::class, fn ($e) => $e->chatUserId === $user->id && $e->isBanned === true);
});
