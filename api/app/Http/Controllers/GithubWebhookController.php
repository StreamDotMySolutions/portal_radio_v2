<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class GithubWebhookController extends Controller
{
    public function handle(Request $request)
    {
        $secret = config('services.github.webhook_secret');

        if (empty($secret)) {
            Log::error('GitHub webhook secret not configured');
            return response()->json(['error' => 'Webhook secret not configured'], 500);
        }

        // Verify signature
        $signature = $request->header('X-Hub-Signature-256');

        if (empty($signature)) {
            return response()->json(['error' => 'Missing signature'], 403);
        }

        $payload = $request->getContent();
        $expected = 'sha256=' . hash_hmac('sha256', $payload, $secret);

        if (!hash_equals($expected, $signature)) {
            return response()->json(['error' => 'Invalid signature'], 403);
        }

        // Only handle push events
        $event = $request->header('X-GitHub-Event');

        if ($event !== 'push') {
            return response()->json(['message' => "Ignored event: {$event}"], 200);
        }

        // Only deploy for the configured branch
        $branch = config('services.github.webhook_branch', 'main');
        $ref = $request->input('ref');

        if ($ref !== "refs/heads/{$branch}") {
            return response()->json(['message' => "Ignored branch: {$ref}"], 200);
        }

        // Run deploy script in background
        $scriptPath = base_path('deploy.sh');
        $logPath = storage_path('logs/deploy.log');

        exec("bash {$scriptPath} > {$logPath} 2>&1 &");

        Log::info('GitHub webhook: deploy triggered', [
            'branch' => $branch,
            'commit' => $request->input('after'),
        ]);

        return response()->json(['message' => 'Deploy triggered'], 200);
    }
}
