<?php

namespace App\Services;

use App\Models\Complaint;
use Illuminate\Support\Facades\Storage;

class ComplaintService
{
    public function store(array $data, $file = null): Complaint
    {
        // Handle file attachment if provided
        if ($file) {
            $filename = CommonService::handleStoreFile($file, 'complaints');
            $data['attachment'] = $filename;
        }

        // Create complaint record
        $complaint = Complaint::create($data);

        // Generate and save reference number
        $ref = 'RTM-COMPLAINT-' . now()->year . '-' . str_pad($complaint->id, 6, '0', STR_PAD_LEFT);
        $complaint->update(['reference_number' => $ref]);

        return $complaint;
    }

    public function destroy(Complaint $complaint): bool
    {
        // Delete attachment if exists
        if ($complaint->attachment) {
            CommonService::handleDeleteFile($complaint->attachment, 'complaints');
        }

        return $complaint->delete();
    }
}
