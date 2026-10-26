// Real-time chat over Laravel Reverb (Pusher protocol). Optional: when the
// NEXT_PUBLIC_REVERB_* variables are missing, subscribeChat() reports
// 'disabled' and ChatWidget keeps using HTTP polling.

const KEY = process.env.NEXT_PUBLIC_REVERB_KEY;
const HOST = process.env.NEXT_PUBLIC_REVERB_HOST;
const PORT = Number(process.env.NEXT_PUBLIC_REVERB_PORT || 443);
const SCHEME = process.env.NEXT_PUBLIC_REVERB_SCHEME || 'https';

let echoPromise = null;

function isRealtimeEnabled() {
  return typeof window !== 'undefined' && !!KEY && !!HOST;
}

// One shared connection per page, created lazily so pusher-js stays out of the server bundle
function getEcho() {
  if (!echoPromise) {
    echoPromise = Promise.all([import('laravel-echo'), import('pusher-js')]).then(
      ([{ default: Echo }, { default: Pusher }]) =>
        new Echo({
          broadcaster: 'reverb',
          Pusher,
          key: KEY,
          wsHost: HOST,
          wsPort: PORT,
          wssPort: PORT,
          forceTLS: SCHEME === 'https',
          enabledTransports: ['ws', 'wss'],
        })
    );
    echoPromise.catch(() => { echoPromise = null; });
  }
  return echoPromise;
}

/**
 * Listen to the public 'chat' channel.
 * handlers: { onMessage(msg), onRemoved({ ids, all }), onUserUpdated({ chat_user_id, is_banned }), onStatus(state) }
 * onStatus receives a pusher-js connection state ('connecting', 'connected', 'unavailable',
 * 'failed', 'disconnected') or 'disabled' when real-time is not configured.
 * Returns an unsubscribe function.
 */
function subscribeChat({ onMessage, onRemoved, onUserUpdated, onStatus }) {
  if (!isRealtimeEnabled()) {
    onStatus?.('disabled');
    return () => {};
  }

  let cancelled = false;
  let cleanup = () => {};

  const message = (data) => onMessage?.(data.message);
  const removed = (data) => onRemoved?.(data);
  const userUpdated = (data) => onUserUpdated?.(data);
  const stateChange = ({ current }) => onStatus?.(current);

  getEcho()
    .then((echo) => {
      if (cancelled) return;
      const channel = echo.channel('chat');
      channel.listen('.message.sent', message);
      channel.listen('.messages.removed', removed);
      channel.listen('.user.updated', userUpdated);

      const connection = echo.connector.pusher.connection;
      connection.bind('state_change', stateChange);
      onStatus?.(connection.state);

      cleanup = () => {
        channel.stopListening('.message.sent', message);
        channel.stopListening('.messages.removed', removed);
        channel.stopListening('.user.updated', userUpdated);
        connection.unbind('state_change', stateChange);
      };
    })
    .catch(() => onStatus?.('failed'));

  return () => {
    cancelled = true;
    cleanup();
  };
}

export { isRealtimeEnabled, subscribeChat };
