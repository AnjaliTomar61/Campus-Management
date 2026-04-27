/**
 * Tiny event-bus for global UI messages.
 * We keep this framework-agnostic so Axios interceptors can emit messages.
 */
const listeners = new Set();

export function subscribeToNotifications(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function notify(payload) {
  for (const listener of listeners) listener(payload);
}

