import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'Missing url param' }, { status: 400 });
  }

  try {
    const res = await fetch(url);
    let html = await res.text();

    // Inject <base> so relative asset paths resolve back to the S3 origin
    const srcUrl = new URL(url);
    const baseHref = srcUrl.origin + srcUrl.pathname.replace(/\/[^/]*$/, '/');
    html = html.replace('<head>', `<head><base href="${baseHref}">`);

    return new NextResponse(html, {
      status: 200,
      headers: { 'Content-Type': 'text/html' },
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
