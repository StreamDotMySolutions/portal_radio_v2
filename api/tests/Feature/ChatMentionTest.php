<?php

use App\Models\ChatUser;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

function mentionUser(string $username, array $attributes = []): ChatUser
{
    return ChatUser::create(array_merge([
        'username' => $username,
        'email' => "{$username}@example.test",
        'password' => bcrypt('secret123'),
        'token' => bin2hex(random_bytes(32)),
        'color' => '#3F3F8F',
    ], $attributes));
}

it('suggests usernames by prefix with public fields only', function () {
    $me = mentionUser('azman');
    mentionUser('alia');
    mentionUser('ali_baba');
    mentionUser('bakar');
    mentionUser('ali_banned', ['is_banned' => true]);

    $response = $this->withHeader('X-Chat-Token', $me->token)
        ->getJson('/api/frontend/chat/users?q=ali')
        ->assertOk();

    expect(collect($response->json('users'))->pluck('username')->all())->toBe(['ali_baba', 'alia'])
        ->and(array_keys($response->json('users.0')))->toEqualCanonicalizing(['id', 'username', 'color', 'avatar_filename']);
});

it('treats underscore in the query literally', function () {
    $me = mentionUser('azman');
    mentionUser('a_b');
    mentionUser('axb');

    $response = $this->withHeader('X-Chat-Token', $me->token)->getJson('/api/frontend/chat/users?q=a_')->assertOk();

    expect(collect($response->json('users'))->pluck('username')->all())->toBe(['a_b']);
});

it('caps suggestions at six', function () {
    $me = mentionUser('zed');
    foreach (range(1, 9) as $i) {
        mentionUser("user{$i}");
    }

    $this->withHeader('X-Chat-Token', $me->token)
        ->getJson('/api/frontend/chat/users?q=user')
        ->assertOk()
        ->assertJsonCount(6, 'users');
});

it('refuses user search without a valid chat token', function () {
    mentionUser('alia');

    $this->getJson('/api/frontend/chat/users?q=ali')->assertStatus(401);
    $this->withHeader('X-Chat-Token', 'nope')->getJson('/api/frontend/chat/users?q=ali')->assertStatus(401);
});

it('rejects queries that are not username characters', function () {
    $me = mentionUser('azman');

    $this->withHeader('X-Chat-Token', $me->token)->getJson('/api/frontend/chat/users?q=a%25')->assertStatus(422);
});
