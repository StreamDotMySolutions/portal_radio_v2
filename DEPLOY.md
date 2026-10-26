# DEPLOY.md — Production deployment guide for AI agents

This guide is for an AI agent (Claude Code, Codex, etc.) deploying **Portal Radio RTM** to production at
`https://radio.rtm.gov.my`. Follow it top to bottom. It is written as instructions to you, the agent.

---

## 0. Rules (read first)

This is a **live public government website**. Every step below is either *safe* (read-only or idempotent) or
marked **⚠ ASK FIRST**, which means stop and get explicit approval from the human operator before running it.

- **Never** run `php artisan migrate:fresh`, `migrate:reset`, `db:wipe`, `db:seed`, or any raw `DROP`/`TRUNCATE`.
- **Never** run `composer update` on the server. Only `composer install` (from the committed `composer.lock`).
- **Never** run `git reset --hard`, `git clean`, `git checkout -- .` or `git stash` on the server without ⚠ ASK FIRST.
  The working tree may hold uploads or hotfixes.
- **Never** print, echo, commit or paste secrets from `.env` files (`APP_KEY`, `DB_PASSWORD`, `REVERB_APP_SECRET`,
  `WEBHOOK_SECRET`, `GITHUB_WEBHOOK_SECRET`, `RECAPTCHA_SECRET_KEY`). When you need to check a value, check
  whether it is *set* (for example `grep -c '^REVERB_APP_KEY=.\+' api/.env`), not what it is.
- Do not edit `.env` files or nginx config unless the human asked for that specific change.
- If a step fails, **stop and report**. Do not improvise fixes on production; diagnose with the troubleshooting
  table (§8), then propose the fix.
- Finish every deployment with the report in §10.

---

## 1. System map

```
                          nginx (TLS, radio.rtm.gov.my)
   ┌───────────────┬──────────────┬───────────────┬────────────────┬─────────────────┐
   /               /backend       /api            /storage         /app  (WebSocket)
   │               │              │               │                │
 Next.js 16      static build    Laravel 10      api/storage/     Laravel Reverb
 (PM2:           backend/build   api/public      app/public       127.0.0.1:8080
 portalradio_v2)                 via PHP-FPM 8.2                  (PM2: portalradio-reverb)
                                      │
                                    MySQL
```

| Part | Source | Runs as | Notes |
|---|---|---|---|
| Public site | `frontend/portalradio_v2/` | PM2 process **`portalradio_v2`** (`next start`) | `NEXT_PUBLIC_*` env values are **baked in at build time** |
| Admin panel | `backend/` | static files from `backend/build`, served at `/backend` | CRA app, `homepage: /backend` |
| API | `api/` | PHP-FPM **8.2** behind nginx `/api` | Laravel 10.50, Sanctum, Spatie permission |
| Chat WebSocket | `api/` (`php artisan reverb:start`) | PM2 process **`portalradio-reverb`**, bound to `127.0.0.1:8080` | Optional: chat falls back to HTTP polling if it is down |
| Deploy dashboard | `frontend/portalradio_v2/app/deploy` | part of the Next.js app, `/deploy` | login = `WEBHOOK_SECRET` from the frontend `.env` |

- **Project root on the server:** `/var/www/portalradio_v2` (the `DEPLOY_PROJECT_ROOT` used by the dashboard). Confirm with `pwd` / `git rev-parse --show-toplevel`.
- **Production PHP:** 8.2.x. The composer lock is pinned to PHP 8.2 (`config.platform.php`), so the CLI `php` **and** PHP-FPM must both be ≥ 8.2.
- **Not stored in this repo, so discover it rather than assume:**
  - the nginx server block for `radio.rtm.gov.my` (`sudo nginx -T | grep -n "radio.rtm.gov.my"`)
  - the port Next.js listens on (`pm2 describe portalradio_v2`)

---

## 2. How deploys are triggered

All three paths run the same steps (§4).

1. **GitHub webhook (automatic).**
   - A push to `main` calls `POST /api/github-webhook`, which runs `bash api/deploy.sh` in the background.
   - Output goes to `api/storage/logs/deploy.log` (webhook) and `deploy.log` in the project root (the script's own `tee`).
   - Only works if the webhook is configured on GitHub and `GITHUB_WEBHOOK_SECRET` is set in `api/.env`. It may not be.
2. **Deploy dashboard.** `https://radio.rtm.gov.my/deploy` has one button per step: Git Pull, Build Frontend, Build Backend, Restart PM2, Migrate DB, Composer Install, Restart Reverb. It also has a read-only **Laravel Log** button: the newest `api/storage/logs/laravel*.log`, its size, the ERROR/CRITICAL count in the last 2000 lines, and the last 200 lines.
3. **SSH (what you will normally do).** `cd /var/www/portalradio_v2 && bash api/deploy.sh`.

Before deploying, check that no other deploy is running: `pgrep -af deploy.sh`. If one is running, wait for it and read its log.

---

## 3. Pre-flight checks (all safe)

Run these from the project root and record the output for your report.

```bash
cd /var/www/portalradio_v2

git status --short | head -20          # unexpected local changes? → stop and report
git rev-parse --short HEAD             # commit currently deployed (needed for rollback)
git fetch origin main && git log --oneline HEAD..origin/main   # what will be deployed

php -v | head -1                       # must be 8.2+
composer --version
node -v && npm -v
pm2 status                             # portalradio_v2 online? portalradio-reverb present?

df -h . | tail -1                      # need free space for node_modules + builds
grep -c '^APP_ENV=production' api/.env # expect 1
```

Then look at what is changing:

```bash
git diff --stat HEAD origin/main
git diff --name-only HEAD origin/main | grep -E 'database/migrations|composer\.lock|package(-lock)?\.json|\.env\.example|deploy\.sh'
```

- **New migrations** → ⚠ ASK FIRST if any migration drops or renames columns or tables, or alters large tables (`analytics_events`, `chat_messages`).
- **`.env.example` changed** → new settings may be needed. Compare the keys only, never the values:
  `diff <(grep -o '^[A-Z_]*=' api/.env.example | sort) <(grep -o '^[A-Z_]*=' api/.env | sort)`.
  Do the same for `frontend/portalradio_v2/.env` and `backend/.env`. Report missing keys to the human.

---

## 4. Standard deployment

**Preferred:** `bash api/deploy.sh` from the project root. It runs the steps below in order and stops on the first failure. Run it in the foreground and watch the output.

| # | Step | Command (cwd) | If it fails |
|---|---|---|---|
| 1 | Pull code | `git pull origin main` (root) | Merge conflict or local changes → stop, report. Never force. |
| 2 | Admin panel | `npm install --no-audit --no-fund && npm run build` (`backend/`) | Build errors → report. The old `backend/build` stays live. |
| 3 | Public site build | `npm run build` (`frontend/portalradio_v2/`) — runs `scripts/build.mjs`: `npm install`, then `next build`, ends with `[build] done` | Report. Do **not** restart PM2 with a broken `.next`. |
| 4 | API dependencies | `composer install --no-dev --optimize-autoloader --no-interaction` (`api/`) | See §8 "composer". |
| 5 | Migrations | `php artisan migrate --force` (`api/`) | Report the exact error. Do not retry blindly. |
| 6 | Restart site | `pm2 restart portalradio_v2` | See §8 "502". |
| 7 | Restart Reverb | start or restart `portalradio-reverb`, then `pm2 save` | Non-fatal: chat falls back to polling. Report it. |

Notes:
- **Dashboard streams can be cut by nginx after ~60s of silence.** The frontend build prints a `[build] … still running` heartbeat to avoid that. The admin panel build (`react-scripts build`) does not: if its stream ends without `--- Process exited with code N ---`, the build is still running. Wait until `https://radio.rtm.gov.my/backend/` serves its `static/js/main.*.js` again before continuing.
- **Build before restart.** Steps 2–3 build while the old site keeps serving. `next build` rewrites `.next` in place, so expect a few seconds of errors on `/` between steps 3 and 6. Keep that window short by running the steps back to back.
- **API changes are live as soon as `git pull` finishes**, because PHP-FPM reads files from disk. If `composer.lock` changed, the API may error until step 4 completes. Run step 4 immediately after the pull.
- **When only part of the repo changed**, you may run just the relevant steps through the dashboard. For example, a change only under `api/app` needs steps 1, 4 and 5 (Composer and Migrate are harmless when nothing changed). When unsure, run the full script.
- **After a config change** (an `.env` edit), Laravel config is not cached in this project, so no `config:clear` is needed. If someone ran `php artisan config:cache`, run `php artisan config:clear`.

---

## 5. First-time setup: real-time chat (Laravel Reverb)

Do this once, the first time this release reaches a server. Check whether it is already done:
`grep -c '^REVERB_APP_KEY=.\+' api/.env` (1 = done) and `pm2 describe portalradio-reverb`.

All of §5 is ⚠ ASK FIRST, because it edits `.env` files and nginx.

1. **API settings (`api/.env`).** Generate new values and never reuse local ones. Set `BROADCAST_DRIVER=reverb` **only** after step 4 below works; until then keep `BROADCAST_DRIVER=null`.
   ```env
   BROADCAST_DRIVER=reverb
   REVERB_APP_ID=<random integer, e.g. php -r "echo random_int(100000,999999);">
   REVERB_APP_KEY=<php -r "echo bin2hex(random_bytes(16));">
   REVERB_APP_SECRET=<php -r "echo bin2hex(random_bytes(16));">
   REVERB_HOST=127.0.0.1
   REVERB_PORT=8080
   REVERB_SCHEME=http
   ```
2. **Frontend settings (`frontend/portalradio_v2/.env`).** These must be in place **before** `npm run build`, then rebuild and restart:
   ```env
   NEXT_PUBLIC_REVERB_KEY=<same value as REVERB_APP_KEY>
   NEXT_PUBLIC_REVERB_HOST=radio.rtm.gov.my
   NEXT_PUBLIC_REVERB_PORT=443
   NEXT_PUBLIC_REVERB_SCHEME=https
   ```
3. **nginx.** Add this to the `radio.rtm.gov.my` HTTPS server block, then run `sudo nginx -t && sudo systemctl reload nginx`. Never reload when `nginx -t` fails.
   ```nginx
   location /app {
       proxy_pass http://127.0.0.1:8080;
       proxy_http_version 1.1;
       proxy_set_header Upgrade $http_upgrade;
       proxy_set_header Connection "Upgrade";
       proxy_set_header Host $host;
       proxy_read_timeout 60s;
   }
   ```
4. **Reverb process** (from `api/`):
   ```bash
   pm2 start artisan --name portalradio-reverb --interpreter php -- reverb:start --host=127.0.0.1 --port=8080
   pm2 save
   pm2 startup     # prints a command to run once with sudo, so PM2 (and Reverb) survive reboots
   ```
5. Run the WebSocket checks in §6. Only then set `BROADCAST_DRIVER=reverb`.

If Reverb is down while `BROADCAST_DRIVER=reverb`, chat still works through polling. Each send logs `Chat broadcast failed` in `api/storage/logs/laravel.log`.

### 5b. First-time setup: Google sign-in for chat

Until this is done, the "Continue with Google" button is simply hidden and `POST /api/frontend/chat/google` returns 503.

1. **The human** creates the OAuth client: Google Cloud Console → APIs & Services → OAuth consent screen (External, app name "Portal Radio RTM", domain `radio.rtm.gov.my`), then Credentials → Create OAuth client ID → **Web application**, with Authorized JavaScript origin `https://radio.rtm.gov.my`. No redirect URI is needed.
2. Put the same Client ID (not a secret, but don't commit it) in both env files:
   - `api/.env`: `GOOGLE_CLIENT_ID=<id>.apps.googleusercontent.com`, then `php artisan config:clear` (or re-run `deploy.sh`).
   - `frontend/portalradio_v2/.env`: `NEXT_PUBLIC_GOOGLE_CLIENT_ID=<same id>`, then **Build Frontend** + restart (it is baked in at build time).
3. The `google_id` column comes from the normal `migrate --force` step.
4. Verify: the button shows on /chat → LOG MASUK; signing in with a Google account either logs in (existing email is linked automatically) or asks for a username.

---

## 6. Verify the deployment (all safe)

Run every check and include the results in your report.

```bash
# Deployed commit matches origin/main
git rev-parse --short HEAD; git rev-parse --short origin/main

# Processes
pm2 status            # portalradio_v2 online, restarts not climbing; portalradio-reverb online (if set up)
pm2 logs portalradio_v2 --lines 30 --nostream

# Public site and admin panel
curl -s -o /dev/null -w "home %{http_code}\n"     https://radio.rtm.gov.my/
curl -s -o /dev/null -w "chat %{http_code}\n"     https://radio.rtm.gov.my/chat
curl -s -o /dev/null -w "admin %{http_code}\n"    https://radio.rtm.gov.my/backend/

# API
curl -s -o /dev/null -w "stations %{http_code}\n" https://radio.rtm.gov.my/api/frontend/stations
curl -s "https://radio.rtm.gov.my/api/frontend/chat/messages?limit=2"
#   → JSON with "messages" (ids ascending, newest last), "created_at_iso" and "has_more"
curl -s -D - -o /dev/null "https://radio.rtm.gov.my/api/frontend/chat/messages?limit=1" | grep -i x-ratelimit-limit
#   → 600 (chat polling has its own limit)

# WebSocket (only if §5 is done) — expect "HTTP/1.1 101 Switching Protocols"
KEY=$(grep '^NEXT_PUBLIC_REVERB_KEY=' frontend/portalradio_v2/.env | cut -d= -f2)
curl -s -i -N --max-time 3 -H "Connection: Upgrade" -H "Upgrade: websocket" \
  -H "Sec-WebSocket-Version: 13" -H "Sec-WebSocket-Key: SGVsbG8gUlRN" \
  "https://radio.rtm.gov.my/app/$KEY?protocol=7" | head -1

# Errors since the deploy (or use the dashboard's "Laravel Log" button)
tail -n 50 api/storage/logs/laravel.log | grep -E "ERROR|CRITICAL" || echo "no new API errors"
```

Treat as failed and go to §7 or §8 if:
- any page or API endpoint returns 5xx
- `pm2 status` shows `errored`, or the restart count keeps rising
- the API logs new `ERROR` lines

---

## 7. Rollback (⚠ ASK FIRST)

Use this when the release is broken and a fix is not immediate. `PREV` is the commit you recorded in §3.

**Preferred (keeps history):** revert on GitHub or locally and push to `main`, then redeploy (§4). `git revert <bad-sha>` creates a new commit; do this from a development machine, not the server.

**Emergency (on the server), only with explicit approval:**
```bash
git checkout PREV -- .                 # restore files from the previous release
cd api && composer install --no-dev --optimize-autoloader --no-interaction && cd ..
(cd backend && npm install --no-audit --no-fund && npm run build)
(cd frontend/portalradio_v2 && npm install --no-audit --no-fund && npm run build)
pm2 restart portalradio_v2 && pm2 restart portalradio-reverb
```
Afterwards the server's working tree differs from `main`. Tell the human; the next normal deploy needs a clean tree.

**Migrations:** only roll back a migration that this release added, and only with approval:
`php artisan migrate:status` → `php artisan migrate:rollback --step=<n>`. Rolling back can lose data written since the deploy.

---

## 8. Troubleshooting

| Symptom | Likely cause | What to do |
|---|---|---|
| `composer install` says "Your lock file does not contain a compatible set of packages… php" | CLI PHP < 8.2 | `php -v`; use the 8.2 binary (e.g. `php8.2 $(which composer) install …`). Report it. |
| API returns 500 with "Composer detected issues in your platform" | PHP-FPM < 8.2, or `vendor/` older than `composer.lock` | Run §4 step 4. Check the FPM socket in nginx is `php8.2-fpm`. |
| `composer` mentions "affected by security advisories" | You ran `update`/`require`, not `install` | Do not run `update` on the server. Laravel 10 is end-of-life; dependency updates are done on a dev machine with `--no-blocking` and committed. |
| `php artisan migrate` prints "Command cancelled" | Missing `--force` in production | Use `php artisan migrate --force`. |
| `/` returns 502 | Next.js not running or crashed | `pm2 logs portalradio_v2 --lines 50`. Usually a failed build: rebuild (§4 step 3), then restart. |
| `/` shows old content after deploy | Not rebuilt or not restarted | Run §4 steps 3 and 6. Check `git rev-parse HEAD`. |
| Chat works but is not instant | Reverb down, `/app` missing in nginx, or frontend built without `NEXT_PUBLIC_REVERB_*` | `pm2 status`, the §6 WebSocket check, `grep -c NEXT_PUBLIC_REVERB_KEY frontend/portalradio_v2/.env`, rebuild. |
| `laravel.log` full of "Chat broadcast failed" | `BROADCAST_DRIVER=reverb` but Reverb unreachable | Start Reverb (§5 step 4), or set `BROADCAST_DRIVER=null` until fixed. |
| Admin panel at `/backend` is blank or 404 | `backend/build` missing or failed build | Rebuild (§4 step 2). nginx serves `/backend` from `backend/build`. |
| Uploaded images 404 under `/storage` | Missing storage link/alias or permissions | `ls -la api/storage/app/public`. nginx aliases `/storage`. Do not run `storage:link` without asking. |
| `npm install` killed / out of memory | Low RAM during build | Report. Build one app at a time and stop nothing else. |

---

## 9. Facts and constraints worth knowing

- **Laravel is 10.x, which is end-of-life.**
  - `laravel/framework` 10.50.3 has 5 known advisories with no 10.x fix.
  - The critical one (TokenGuard) does not apply: the app uses the session guard plus Sanctum.
  - The proper fix is upgrading to Laravel 12, a separate project. Never try it during a deploy.
- **Rate limits.**
  - Global `api` group: 200 requests/min per IP.
  - Chat polling: 600/min per IP.
  - Chat sending: 10/min per chat account.
- **Queues are synchronous** (`QUEUE_CONNECTION=sync`), so there is no queue worker to restart. Broadcasts are sent inline (`ShouldBroadcastNow`).
- **The deploy dashboard runs commands with `shell: true`.** New dashboard commands must be a single shell string when they need shell syntax (see `restart-reverb` in `app/api/deploy/run/route.js`).
- **Local development needs PHP 8.3 or 8.2.** The lock file no longer installs on PHP 8.1.

---

## 10. Report back to the human

End every deployment with this summary (no secrets):

```
Deploy: <success | failed at step N | rolled back>
Commit: <PREV sha> → <new sha>  (<n> commits)
Changed: <frontend / admin / api / migrations / dependencies / config>
Migrations run: <list or "none">
Checks (§6): home <code>, chat <code>, admin <code>, stations <code>, chat API <ok/fail>, WebSocket <101/skipped/fail>
PM2: portalradio_v2 <status>, portalradio-reverb <status>
New errors in laravel.log: <none | summary>
Needs human action: <missing .env keys, nginx changes, approvals, anything you did not do>
```
