<?php

namespace App\Http\Controllers\Frontend;

use App\Models\AnalyticsEvent;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class DownloadController extends Controller
{
    public function asset(Request $request, $filename)
    {
        $path = storage_path("app/public/assets/{$filename}");

        if (!file_exists($path)) {
            abort(404);
        }

        $this->trackDownload($request, $filename, 'asset');

        return response()->download($path);
    }

    public function articlePdf(Request $request, $filename)
    {
        $path = storage_path("app/public/article_pdf/{$filename}");

        if (!file_exists($path)) {
            abort(404);
        }

        $this->trackDownload($request, $filename, 'article_pdf');

        return response()->file($path, [
            'Content-Type' => 'application/pdf',
        ]);
    }

    private function trackDownload(Request $request, string $filename, string $pageType): void
    {
        AnalyticsEvent::create([
            'session_id'      => $request->input('sid', $request->ip()),
            'event_type'      => 'download',
            'page_type'       => $pageType,
            'reference_id'    => null,
            'reference_title' => $filename,
            'device_type'     => null,
            'referrer'        => $request->header('Referer'),
        ]);
    }
}
