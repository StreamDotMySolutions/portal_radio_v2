<?php

use App\Models\ChatUser;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Http;

uses(RefreshDatabase::class);

const GOOGLE_TEST_CLIENT = 'test-client.apps.googleusercontent.com';

beforeEach(function () {
    config(['services.google.client_id' => GOOGLE_TEST_CLIENT]);
});

function fakeGoogleClaims(array $overrides = []): void
{
    Http::fake(['oauth2.googleapis.com/*' => Http::response(array_merge([
        'aud' => GOOGLE_TEST_CLIENT,
        'iss' => 'https://accounts.google.com',
        'sub' => '1098765432100',
        'email' => 'siti.aminah@gmail.com',
        'email_verified' => 'true',
        'exp' => (string) (time() + 3600),
    ], $overrides))]);
}

function googleChatUser(string $username, array $attrs = []): ChatUser
{
    return ChatUser::create(array_merge([
        'username' => $username,
        'email' => "{$username}@example.test",
        'password' => bcrypt('secret123'),
        'token' => bin2hex(random_bytes(32)),
        'color' => '#3F3F8F',
    ], $attrs));
}

it('rejects tokens for another client, unverified emails and expired tokens', function (array $claims) {
    fakeGoogleClaims($claims);

    $this->postJson('/api/frontend/chat/google', ['credential' => 'jwt'])->assertStatus(401);
})->with([
    'wrong audience' => [['aud' => 'someone-else.apps.googleusercontent.com']],
    'unverified email' => [['email_verified' => 'false']],
    'expired' => [['exp' => (string) (time() - 10)]],
    'wrong issuer' => [['iss' => 'https://evil.example']],
]);

it('rejects a token Google does not accept', function () {
    Http::fake(['oauth2.googleapis.com/*' => Http::response(['error' => 'invalid_token'], 400)]);

    $this->postJson('/api/frontend/chat/google', ['credential' => 'jwt'])->assertStatus(401);
});

it('is unavailable when no client id is configured', function () {
    config(['services.google.client_id' => null]);

    $this->postJson('/api/frontend/chat/google', ['credential' => 'jwt'])->assertStatus(503);
});

it('logs in a user already linked to the Google account', function () {
    $user = googleChatUser('glinked' . uniqid(), ['google_id' => '1098765432100']);
    fakeGoogleClaims();

    $this->postJson('/api/frontend/chat/google', ['credential' => 'jwt'])
        ->assertOk()
        ->assertJsonPath('user.id', $user->id)
        ->assertJsonPath('user.token', $user->token);
});

it('links and verifies an existing account with the same email', function () {
    $user = googleChatUser('gmail' . uniqid(), ['email' => 'siti.aminah@gmail.com']);
    expect($user->email_verified_at)->toBeNull();
    fakeGoogleClaims();

    $this->postJson('/api/frontend/chat/google', ['credential' => 'jwt'])
        ->assertOk()
        ->assertJsonPath('user.id', $user->id);

    $user->refresh();
    expect($user->google_id)->toBe('1098765432100')
        ->and($user->email_verified_at)->not->toBeNull();
});

it('asks a new user to pick a username, then creates a verified account', function () {
    fakeGoogleClaims();

    $first = $this->postJson('/api/frontend/chat/google', ['credential' => 'jwt'])
        ->assertOk()
        ->assertJsonPath('needs_username', true)
        ->assertJsonMissingPath('user');
    expect($first->json('suggested_username'))->toStartWith('siti_aminah');
    expect(ChatUser::where('email', 'siti.aminah@gmail.com')->exists())->toBeFalse();

    $username = 'siti' . substr(uniqid(), -6);
    $this->postJson('/api/frontend/chat/google/complete', [
        'signup_token' => $first->json('signup_token'),
        'username' => $username,
    ])->assertCreated()->assertJsonPath('user.username', $username);

    $user = ChatUser::where('username', $username)->first();
    expect($user->google_id)->toBe('1098765432100')
        ->and($user->email)->toBe('siti.aminah@gmail.com')
        ->and($user->email_verified_at)->not->toBeNull()
        ->and(strlen($user->token))->toBe(64);
});

it('suggests a free username when the email prefix is taken', function () {
    googleChatUser('siti_aminah');
    fakeGoogleClaims();

    $this->postJson('/api/frontend/chat/google', ['credential' => 'jwt'])
        ->assertJsonPath('suggested_username', 'siti_aminah2');
});

it('rejects a taken username when completing signup', function () {
    $taken = googleChatUser('taken' . uniqid());
    fakeGoogleClaims();
    $token = $this->postJson('/api/frontend/chat/google', ['credential' => 'jwt'])->json('signup_token');

    $this->postJson('/api/frontend/chat/google/complete', ['signup_token' => $token, 'username' => $taken->username])
        ->assertStatus(422)
        ->assertJsonValidationErrors('username');
});

it('rejects tampered and expired signup tokens', function () {
    $username = 'gx' . substr(uniqid(), -6);

    $this->postJson('/api/frontend/chat/google/complete', ['signup_token' => 'not-a-token', 'username' => $username])
        ->assertStatus(422);

    $expired = Crypt::encryptString(json_encode(['sub' => '1', 'email' => 'x@gmail.com', 'exp' => time() - 1]));
    $this->postJson('/api/frontend/chat/google/complete', ['signup_token' => $expired, 'username' => $username])
        ->assertStatus(422);

    expect(ChatUser::where('username', $username)->exists())->toBeFalse();
});
