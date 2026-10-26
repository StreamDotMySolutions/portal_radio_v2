// `npm run build`: install dependencies, then `next build`.
// - Installing first keeps the /deploy dashboard's "Build Frontend" correct when
//   package.json gains a dependency (the dashboard has no separate install step).
// - A heartbeat line every 20s keeps the dashboard's streamed output alive behind
//   nginx, so long silent compile phases don't cut the connection before the exit code.
import { spawn } from 'node:child_process';

const HEARTBEAT_MS = 20000;

function run(label, command, args) {
  return new Promise((resolve) => {
    const started = Date.now();
    const heartbeat = setInterval(() => {
      console.log(`[build] ${label} still running (${Math.round((Date.now() - started) / 1000)}s)`);
    }, HEARTBEAT_MS);
    const child = spawn(command, args, { stdio: 'inherit', shell: process.platform === 'win32' });
    child.on('close', (code) => {
      clearInterval(heartbeat);
      resolve(code ?? 1);
    });
    child.on('error', (err) => {
      clearInterval(heartbeat);
      console.error(`[build] ${label} failed to start: ${err.message}`);
      resolve(1);
    });
  });
}

const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';

let code = await run('npm install', npm, ['install', '--no-audit', '--no-fund']);
if (code === 0) code = await run('next build', npm, ['exec', '--', 'next', 'build']);

console.log(code === 0 ? '[build] done' : `[build] FAILED (exit ${code})`);
process.exit(code);
