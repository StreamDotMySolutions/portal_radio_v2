<?php
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use App\Models\User;
use App\Models\Application;

beforeEach(function () {
    // Ensure your database is migrated and refreshed
    $this->artisan('migrate');
});

it('can create a new application after logging in', function () {
    // Fetch the existing user from the database
    $existingUser = User::where('email', 'user@local')->first();

    // Authenticate the user with Sanctum
    Sanctum::actingAs($existingUser);

    // Send a POST request to create a new application
    $response = $this->postJson('/api/applications', [
        'description' => 'This is a test application.',
    ]);

    // Assert the response status code (assuming a successful creation returns 201)
    $response->assertStatus(200);

});

it('cannot create a new application with a null description', function () {
    // Fetch the existing user from the database
    $existingUser = User::where('email', 'user@local')->first();

    // Authenticate the user with Sanctum
    Sanctum::actingAs($existingUser);

    // Send a POST request with a null description
    $response = $this->postJson('/api/applications', [
        'description' => null,
    ]);

    // Assert the response status code (assuming a validation failure returns 422)
    $response->assertStatus(422);

    // Assert that the "description" field has a validation error
    $response->assertJsonValidationErrors('description');
});
