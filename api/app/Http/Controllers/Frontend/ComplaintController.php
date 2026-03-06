<?php

namespace App\Http\Controllers\Frontend;

use App\Models\Complaint;
use App\Services\ComplaintService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class ComplaintController extends Controller
{
    private $complaintService;

    public function __construct(ComplaintService $complaintService)
    {
        $this->complaintService = $complaintService;
    }

    public function store(Request $request)
    {
        // Verify reCAPTCHA token
        $verify = Http::asForm()->post('https://www.google.com/recaptcha/api/siteverify', [
            'secret'   => config('services.recaptcha.secret'),
            'response' => $request->input('recaptcha_token'),
            'remoteip' => $request->ip(),
        ]);

        if (!$verify->json('success')) {
            return response()->json(['message' => 'Pengesahan reCAPTCHA gagal.'], 422);
        }

        // Validate fields
        $validated = $request->validate([
            'full_name'       => 'required|string|max:255',
            'email'           => 'required|email|max:255',
            'phone_number'    => 'nullable|string|max:20',
            'category'        => 'required|in:Kandungan Siaran,Masalah Teknikal,Perkhidmatan Pelanggan,Lain-lain',
            'platform'        => 'required|in:TV1,TV2,Okey,Sukan RTM,Nasional FM,Klasik Nasional,Minnal FM,Traxx FM,Ai FM,RTM Website,Lain-lain',
            'programme_name'  => 'nullable|string|max:255',
            'incident_at'     => 'required|date',
            'subject'         => 'required|string|max:255',
            'description'     => 'required|string',
            'attachment'      => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
        ], [
            'full_name.required'       => 'Nama penuh wajib diisi.',
            'full_name.string'         => 'Nama penuh mesti berupa teks.',
            'full_name.max'            => 'Nama penuh tidak boleh melebihi 255 aksara.',
            'email.required'           => 'Alamat email wajib diisi.',
            'email.email'              => 'Alamat email tidak sah.',
            'email.max'                => 'Alamat email tidak boleh melebihi 255 aksara.',
            'phone_number.string'      => 'Nombor telefon mesti berupa teks.',
            'phone_number.max'         => 'Nombor telefon tidak boleh melebihi 20 aksara.',
            'category.required'        => 'Kategori wajib dipilih.',
            'category.in'              => 'Kategori yang dipilih tidak sah.',
            'platform.required'        => 'Platform wajib dipilih.',
            'platform.in'              => 'Platform yang dipilih tidak sah.',
            'programme_name.string'    => 'Nama program mesti berupa teks.',
            'programme_name.max'       => 'Nama program tidak boleh melebihi 255 aksara.',
            'incident_at.required'     => 'Tarikh dan masa insiden wajib diisi.',
            'incident_at.date'         => 'Format tarikh dan masa tidak sah.',
            'subject.required'         => 'Tajuk wajib diisi.',
            'subject.string'           => 'Tajuk mesti berupa teks.',
            'subject.max'              => 'Tajuk tidak boleh melebihi 255 aksara.',
            'description.required'     => 'Penerangan wajib diisi.',
            'description.string'       => 'Penerangan mesti berupa teks.',
            'attachment.image'         => 'Lampiran mesti berupa imej.',
            'attachment.mimes'         => 'Lampiran mesti dalam format: jpeg, png, jpg, gif, webp.',
            'attachment.max'           => 'Lampiran tidak boleh melebihi 2MB.',
        ]);

        // Store complaint
        $complaint = $this->complaintService->store($validated, $request->file('attachment'));

        return response()->json([
            'message' => 'Aduan anda telah diterima.',
            'reference_number' => $complaint->reference_number,
        ], 200);
    }
}
