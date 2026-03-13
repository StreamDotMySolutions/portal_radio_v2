<?php

namespace App\Http\Controllers\Backend;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;

class SettingController extends Controller
{
    /**
     * Get all settings
     */
    public function index(): JsonResponse
    {
        $settings = Setting::orderBy('key')->get();
        return response()->json(['settings' => $settings]);
    }

    /**
     * Get a setting by key
     */
    public function show(string $key): JsonResponse
    {
        $setting = Setting::where('key', $key)->firstOrFail();
        return response()->json(['setting' => $setting]);
    }

    /**
     * Update a setting by key
     */
    public function update(Request $request, string $key): JsonResponse
    {
        $setting = Setting::where('key', $key)->firstOrFail();
        $request->validate(['value' => 'required|string|max:500']);
        $setting->update(['value' => $request->input('value')]);

        // Invalidate footer cache if updating footer_* settings
        if (str_starts_with($key, 'footer_')) {
            Cache::forget('frontend.footer');
        }

        return response()->json(['message' => 'Setting updated successfully']);
    }

    /**
     * Get livestream URL for public access
     */
    public function livestreamUrl(): JsonResponse
    {
        return response()->json([
            'stream_url' => Setting::get('livestream_url'),
        ]);
    }
}
