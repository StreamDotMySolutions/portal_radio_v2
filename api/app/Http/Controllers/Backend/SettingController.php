<?php

namespace App\Http\Controllers\Backend;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class SettingController extends Controller
{
    /**
     * Get a setting by key
     */
    public function show(string $key): Response
    {
        $setting = Setting::where('key', $key)->firstOrFail();
        return response()->json(['setting' => $setting]);
    }

    /**
     * Update a setting by key
     */
    public function update(Request $request, string $key): Response
    {
        $setting = Setting::where('key', $key)->firstOrFail();
        $request->validate(['value' => 'required|string|max:500']);
        $setting->update(['value' => $request->input('value')]);
        return response()->json(['message' => 'Setting updated successfully']);
    }
}
