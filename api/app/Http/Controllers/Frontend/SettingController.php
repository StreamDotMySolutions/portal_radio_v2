<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Response;

class SettingController extends Controller
{
    /**
     * Get livestream URL for public access
     */
    public function livestreamUrl(): Response
    {
        return response()->json(['stream_url' => Setting::get('livestream_url', '')]);
    }
}
