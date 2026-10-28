<?php

namespace App\Http\Controllers\Backend;

use Illuminate\Http\Request;
use App\Models\StationVideo;
use App\Services\StationVideoService;

class StationVideoController extends Controller
{
    public function __construct(private StationVideoService $service)
    {
    }

    private function fileRules(): array
    {
        // max is in KB
        return ['file', 'mimetypes:video/mp4,video/quicktime,video/x-msvideo,video/x-matroska,video/webm,video/mpeg,video/x-m4v',
            'max:' . (config('ffmpeg.max_upload_mb') * 1024)];
    }

    private function messages(): array
    {
        return [
            'file.mimetypes' => 'Fail mesti video (MP4, MOV, AVI, MKV, WebM atau MPEG).',
            'file.max'       => 'Fail video melebihi had ' . config('ffmpeg.max_upload_mb') . ' MB.',
            'file.uploaded'  => 'Muat naik gagal. Fail mungkin melebihi had pelayan.',
        ];
    }

    public function index(Request $request)
    {
        $videos = $this->service->listForAdmin($request->only(['station_id', 'search', 'sort_by', 'sort_dir']));

        return response()->json(['videos' => $videos]);
    }

    public function show(StationVideo $stationVideo)
    {
        return response()->json(['video' => $stationVideo->load('station:id,title,slug')]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'station_id'  => 'required|integer|exists:stations,id',
            'title'       => 'required|string|max:255',
            'description' => 'nullable|string|max:2000',
            'file'        => array_merge(['required'], $this->fileRules()),
        ], $this->messages());

        try {
            $video = $this->service->store($data, $request->file('file'), auth('sanctum')->id());
        } catch (\RuntimeException $e) {
            report($e);
            return response()->json(['message' => $e->getMessage()], 500);
        }

        return response()->json(['message' => 'Video dimuat naik. Penukaran sedang berjalan.', 'video' => $video], 201);
    }

    public function update(Request $request, StationVideo $stationVideo)
    {
        $data = $request->validate([
            'title'       => 'sometimes|required|string|max:255',
            'description' => 'nullable|string|max:2000',
            'file'        => array_merge(['nullable'], $this->fileRules()),
        ], $this->messages());

        try {
            $video = $this->service->update($stationVideo, $data, $request->file('file'));
        } catch (\RuntimeException $e) {
            report($e);
            return response()->json(['message' => $e->getMessage()], 500);
        }

        return response()->json(['message' => 'Video dikemas kini.', 'video' => $video]);
    }

    public function delete(StationVideo $stationVideo)
    {
        $this->service->delete($stationVideo);

        return response()->json(['message' => 'Video dipadam.']);
    }

    public function toggle(StationVideo $stationVideo)
    {
        $stationVideo->update(['active' => ! $stationVideo->active]);

        return response()->json(['message' => 'Status video dikemas kini.']);
    }

    public function retry(StationVideo $stationVideo)
    {
        if (! $this->service->retry($stationVideo)) {
            return response()->json(['message' => 'Video ini tidak boleh dicuba semula. Sila muat naik fail semula.'], 422);
        }

        return response()->json(['message' => 'Penukaran dimulakan semula.']);
    }

    public function ordering(StationVideo $stationVideo, Request $request)
    {
        switch ($request->input('direction')) {
            case 'up':
                $stationVideo->up();
                break;
            case 'down':
                $stationVideo->down();
                break;
        }

        return response()->json(['message' => 'Susunan dikemas kini.']);
    }
}
