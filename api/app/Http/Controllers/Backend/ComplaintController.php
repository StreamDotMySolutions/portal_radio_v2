<?php

namespace App\Http\Controllers\Backend;

use App\Models\Complaint;
use App\Services\ComplaintService;
use App\Services\CommonService;
use Illuminate\Http\Request;

class ComplaintController extends Controller
{
    private $complaintService;

    public function __construct(ComplaintService $complaintService)
    {
        $this->complaintService = $complaintService;
    }

    public function index(Request $request)
    {
        $query = Complaint::query();

        // Search by name, email, subject, reference number
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('full_name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('subject', 'like', "%{$search}%")
                  ->orWhere('reference_number', 'like', "%{$search}%");
            });
        }

        // Filter by category
        if ($request->filled('category')) {
            $query->where('category', $request->input('category'));
        }

        // Filter by platform
        if ($request->filled('platform')) {
            $query->where('platform', $request->input('platform'));
        }

        // Sort
        $sortBy = $request->input('sort_by');
        $sortDir = $request->input('sort_dir', 'desc');

        if ($sortBy === 'name') {
            $query->orderBy('full_name', $sortDir);
        } elseif ($sortBy === 'date') {
            $query->orderBy('created_at', $sortDir);
        } else {
            $query->orderBy('created_at', 'desc');
        }

        $complaints = $query->paginate(15)->withQueryString();

        return response()->json(['complaints' => $complaints]);
    }

    public function show(Complaint $complaint)
    {
        return response()->json(['complaint' => $complaint]);
    }

    public function destroy(Complaint $complaint)
    {
        // Delete attachment if exists
        if ($complaint->attachment) {
            CommonService::handleDeleteFile($complaint->attachment, 'complaints');
        }

        if ($complaint->delete()) {
            return response()->json(['message' => 'Aduan berjaya dihapus.']);
        } else {
            return response()->json(['message' => 'Gagal menghapus aduan.'], 500);
        }
    }
}
