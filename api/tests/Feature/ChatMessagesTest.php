<?php

use App\Models\ChatMessage;
use App\Models\ChatUser;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

function makeChatUser(string $username): ChatUser
{
    return ChatUser::create([
        'username' => $username,
        'email' => "{$username}@example.test",
        'password' => bcrypt('secret123'),
        'token' => bin2hex(random_bytes(32)),
        'color' => '#3F3F8F',
    ]);
}

function seedMessages(ChatUser $user, int $count): void
{
    for ($i = 1; $i <= $count; $i++) {
        $user->messages()->create(['message' => "mesej {$i}"]);
    }
}

it('returns the newest messages in ascending order on first load', function () {
    seedMessages(makeChatUser('ali'), 60);
    $maxId = ChatMessage::max('id');

    $response = $this->getJson('/api/frontend/chat/messages?limit=50')->assertOk();

    $ids = collect($response->json('messages'))->pluck('id')->all();
    expect($ids)->toHaveCount(50)
        ->and(end($ids))->toBe($maxId)
        ->and($ids)->toBe(collect($ids)->sort()->values()->all())
        ->and($response->json('has_more'))->toBeTrue()
        ->and($response->json('messages.0.created_at_iso'))->not->toBeNull();
});

it('returns only newer messages when polling with after', function () {
    seedMessages(makeChatUser('ali'), 10);
    $ids = ChatMessage::orderBy('id')->pluck('id');

    $response = $this->getJson('/api/frontend/chat/messages?after=' . $ids[6])->assertOk();

    expect(collect($response->json('messages'))->pluck('id')->all())->toBe($ids->slice(7)->values()->all())
        ->and($response->json())->not->toHaveKey('has_more');
});

it('pages older history with before', function () {
    seedMessages(makeChatUser('ali'), 30);
    $ids = ChatMessage::orderBy('id')->pluck('id');

    $page = $this->getJson('/api/frontend/chat/messages?limit=10&before=' . $ids[15])->assertOk();
    expect(collect($page->json('messages'))->pluck('id')->all())->toBe($ids->slice(5, 10)->values()->all())
        ->and($page->json('has_more'))->toBeTrue();

    $first = $this->getJson('/api/frontend/chat/messages?limit=10&before=' . $ids[5])->assertOk();
    expect($first->json('messages'))->toHaveCount(5)
        ->and($first->json('has_more'))->toBeFalse();
});

it('echoes client_id back when sending', function () {
    $user = makeChatUser('ali');

    $this->withHeader('X-Chat-Token', $user->token)
        ->postJson('/api/frontend/chat/messages', ['message' => 'Salam', 'client_id' => 'tmp-123'])
        ->assertCreated()
        ->assertJsonPath('message.client_id', 'tmp-123')
        ->assertJsonPath('message.message', 'Salam')
        ->assertJsonPath('message.username', 'ali');
});

it('rate limits sending per chat account, not per IP', function () {
    $ali = makeChatUser('ali');
    $abu = makeChatUser('abu');

    for ($i = 0; $i < 10; $i++) {
        $this->withHeader('X-Chat-Token', $ali->token)
            ->postJson('/api/frontend/chat/messages', ['message' => "hai {$i}"])
            ->assertCreated();
    }

    $this->withHeader('X-Chat-Token', $ali->token)
        ->postJson('/api/frontend/chat/messages', ['message' => 'satu lagi'])
        ->assertStatus(429);

    $this->withHeader('X-Chat-Token', $abu->token)
        ->postJson('/api/frontend/chat/messages', ['message' => 'saya pula'])
        ->assertCreated();
});

it('does not apply the shared api throttle to message polling', function () {
    $response = $this->getJson('/api/frontend/chat/messages')->assertOk();

    expect((int) $response->headers->get('X-RateLimit-Limit'))->toBe(600);
});
