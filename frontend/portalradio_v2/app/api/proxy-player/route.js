import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'Missing url param' }, { status: 400 });
  }

  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    if (!res.ok) {
      return NextResponse.json({ error: `Failed to fetch: ${res.status}` }, { status: 500 });
    }

    let html = await res.text();

    // Inject <base> so relative asset paths resolve back to the S3 origin
    const srcUrl = new URL(url);
    const baseHref = srcUrl.origin + srcUrl.pathname.replace(/\/[^/]*$/, '/');

    // Try to inject base tag - handle both <head> and no head tag
    if (html.includes('<head>')) {
      html = html.replace('<head>', `<head><base href="${baseHref}">`);
    } else if (html.includes('<!DOCTYPE') || html.includes('<html')) {
      // If no head tag, try to add it after html tag
      html = html.replace(/(<html[^>]*>)/i, `$1<head><base href="${baseHref}"></head>`);
    }

    return new NextResponse(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'X-Frame-Options': 'SAMEORIGIN',
      },
    });
  } catch (err) {
    console.error('Proxy player error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
