<?php

namespace App\Http\Controllers\Frontend;

use Illuminate\Http\Request;
use App\Models\Setting;
use App\Models\FooterLink;
use Illuminate\Support\Facades\Cache;

class FooterController extends Controller
{
    public function index()
    {
        $data = Cache::remember('frontend.footer', 3600, function () {
            return [
                'description'        => Setting::get('footer_description', ''),
                'phone'              => Setting::get('footer_phone', ''),
                'email'              => Setting::get('footer_email', ''),
                'address'            => Setting::get('footer_address', ''),
                'copyright'          => Setting::get('footer_copyright', ''),
                'section_about'      => Setting::get('footer_section_about', 'Tentang Portal Radio RTM'),
                'section_quick'      => Setting::get('footer_section_quick', 'Pautan Pantas'),
                'section_network'    => Setting::get('footer_section_network', 'Rangkaian RTM'),
                'section_contact'    => Setting::get('footer_section_contact', 'Hubungi Kami'),
                'quick_links'        => FooterLink::where('section', 'quick')
                    ->where('active', true)
                    ->orderBy('ordering')
                    ->get(['id', 'title', 'url', 'is_external']),
                'network_links'      => FooterLink::where('section', 'network')
                    ->where('active', true)
                    ->orderBy('ordering')
                    ->get(['id', 'title', 'url', 'is_external']),
            ];
        });

        return response()->json($data);
    }
}
