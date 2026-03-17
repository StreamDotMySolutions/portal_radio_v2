import { NextResponse } from 'next/server';
import { createSession } from '@/lib/deploySessions';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request) {
    try {
        const { secret } = await request.json();
        const webhookSecret = process.env.WEBHOOK_SECRET;

        if (!webhookSecret) {
            return NextResponse.json({ error: 'WEBHOOK_SECRET not configured' }, { status: 500 });
        }

        if (secret !== webhookSecret) {
            return NextResponse.json({ error: 'Invalid secret' }, { status: 401 });
        }

        const token = createSession();
        return NextResponse.json({ token });
    } catch {
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
}
