<?php

namespace App\Http\Controllers\Backend;

use Illuminate\Http\Request;
use App\Models\FooterLink;
use Illuminate\Support\Facades\Cache;

class FooterLinkController extends Controller
{
    public function index(Request $request)
    {
        $query = FooterLink::query();

        // Filter by section
        if ($request->filled('section')) {
            $query->where('section', $request->input('section'));
        }

        // Search by title
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where('title', 'like', "%{$search}%");
        }

        // Filter by active status
        if ($request->has('active') && $request->input('active') !== '') {
            $query->where('active', $request->input('active'));
        }

        // Order by section and ordering
        $links = $query->orderBy('section')->orderBy('ordering')->paginate(100)->withQueryString();

        return response()->json(['footer_links' => $links]);
    }

    public function show(FooterLink $footerLink)
    {
        return response()->json(['footer_link' => $footerLink]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'section'     => 'required|in:quick,network',
            'title'       => 'required|string|max:100',
            'url'         => 'required|string|max:500',
            'is_external' => 'sometimes|boolean',
            'active'      => 'sometimes|boolean',
        ]);

        // Get max ordering for this section
        $maxOrdering = FooterLink::where('section', $request->input('section'))
            ->max('ordering') ?? 0;

        $footerLink = FooterLink::create([
            'user_id'     => auth('sanctum')->user()->id,
            'section'     => $request->input('section'),
            'title'       => $request->input('title'),
            'url'         => $request->input('url'),
            'is_external' => $request->input('is_external', false),
            'active'      => $request->input('active', true),
            'ordering'    => $maxOrdering + 1,
        ]);

        // Invalidate cache
        Cache::forget('frontend.footer');

        return response()->json(['message' => 'Footer link created successfully']);
    }

    public function update(Request $request, FooterLink $footerLink)
    {
        $request->validate([
            'section'     => 'sometimes|in:quick,network',
            'title'       => 'sometimes|string|max:100',
            'url'         => 'sometimes|string|max:500',
            'is_external' => 'sometimes|boolean',
            'active'      => 'sometimes|boolean',
        ]);

        $data = $request->only(['section', 'title', 'url', 'is_external', 'active']);
        $footerLink->update($data);

        // Invalidate cache
        Cache::forget('frontend.footer');

        return response()->json(['message' => 'Footer link updated successfully']);
    }

    public function delete(FooterLink $footerLink)
    {
        if ($footerLink->delete()) {
            // Invalidate cache
            Cache::forget('frontend.footer');
            return response()->json(['message' => 'Footer link deleted successfully']);
        }

        return response()->json(['message' => 'Footer link deletion failed'], 500);
    }

    public function toggle(FooterLink $footerLink)
    {
        $footerLink->update(['active' => $footerLink->active == 1 ? 0 : 1]);

        // Invalidate cache
        Cache::forget('frontend.footer');

        return response()->json(['message' => 'Footer link toggled successfully']);
    }

    public function ordering(FooterLink $footerLink, Request $request)
    {
        $direction = $request->input('direction');

        if ($direction === 'up') {
            // Swap with previous item in same section
            $previous = FooterLink::where('section', $footerLink->section)
                ->where('ordering', '<', $footerLink->ordering)
                ->orderBy('ordering', 'desc')
                ->first();

            if ($previous) {
                $temp = $footerLink->ordering;
                $footerLink->update(['ordering' => $previous->ordering]);
                $previous->update(['ordering' => $temp]);
            }
        } elseif ($direction === 'down') {
            // Swap with next item in same section
            $next = FooterLink::where('section', $footerLink->section)
                ->where('ordering', '>', $footerLink->ordering)
                ->orderBy('ordering')
                ->first();

            if ($next) {
                $temp = $footerLink->ordering;
                $footerLink->update(['ordering' => $next->ordering]);
                $next->update(['ordering' => $temp]);
            }
        }

        // Invalidate cache
        Cache::forget('frontend.footer');

        return response()->json(['message' => 'Ordering updated successfully']);
    }
}
