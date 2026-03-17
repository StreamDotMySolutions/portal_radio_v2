import { NextResponse } from 'next/server';
import { validateSession } from '@/lib/deploySessions';
import { spawn } from 'child_process';
import path from 'path';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function getProjectRoot() {
    return process.env.DEPLOY_PROJECT_ROOT || path.resolve(process.cwd(), '..', '..');
}

function getCommands() {
    const root = getProjectRoot();
    return {
        'git-pull': {
            cmd: 'git',
            args: ['pull', 'origin', 'main'],
            cwd: root,
        },
        'build-frontend': {
            cmd: 'npm',
            args: ['run', 'build'],
            cwd: path.join(root, 'frontend', 'portalradio_v2'),
        },
        'build-backend': {
            cmd: 'npm',
            args: ['run', 'build'],
            cwd: path.join(root, 'backend'),
        },
        'restart-pm2': {
            cmd: 'pm2',
            args: ['restart', 'portalradio_v2'],
            cwd: root,
        },
        'migrate-db': {
            cmd: 'php',
            args: ['artisan', 'migrate', '--force'],
            cwd: path.join(root, 'api'),
        },
    };
}

export async function POST(request) {
    try {
        const { token, action } = await request.json();

        if (!validateSession(token)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const commands = getCommands();
        const command = commands[action];
        if (!command) {
            return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
        }

        const stream = new ReadableStream({
            start(controller) {
                const encoder = new TextEncoder();
                const send = (text) => controller.enqueue(encoder.encode(text));

                send(`$ ${command.cmd} ${command.args.join(' ')}\n`);
                send(`  cwd: ${command.cwd}\n\n`);

                const child = spawn(command.cmd, command.args, {
                    cwd: command.cwd,
                    shell: true,
                    env: { ...process.env },
                });

                child.stdout.on('data', (data) => send(data.toString()));
                child.stderr.on('data', (data) => send(data.toString()));

                child.on('close', (code) => {
                    send(`\n--- Process exited with code ${code} ---\n`);
                    controller.close();
                });

                child.on('error', (err) => {
                    send(`\nError: ${err.message}\n`);
                    controller.close();
                });
            },
        });

        return new Response(stream, {
            headers: {
                'Content-Type': 'text/plain; charset=utf-8',
                'Transfer-Encoding': 'chunked',
                'Cache-Control': 'no-cache',
            },
        });
    } catch {
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
}
