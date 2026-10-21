/* Local development only: prevent stale service-worker modules from masking the current Vite build. */
if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
  navigator.serviceWorker?.getRegistrations?.().then(registrations => {
    registrations.forEach(registration => registration.unregister());
  }).catch(() => {});
  window.caches?.keys?.().then(keys => {
    keys.forEach(key => window.caches.delete(key));
  }).catch(() => {});
}
