// Single registrar for the generated app service worker (/sw.js).
// Never register in dev, Lovable previews, iframes or with ?sw=off;
// in those contexts, unregister any matching stale registration instead.
export function registerServiceWorker(): void {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

  const hostname = window.location.hostname;
  const refused =
    !import.meta.env.PROD ||
    window.self !== window.top ||
    hostname.startsWith("id-preview--") ||
    hostname.startsWith("preview--") ||
    hostname === "lovableproject.com" ||
    hostname.endsWith(".lovableproject.com") ||
    hostname === "lovableproject-dev.com" ||
    hostname.endsWith(".lovableproject-dev.com") ||
    hostname === "beta.lovable.dev" ||
    hostname.endsWith(".beta.lovable.dev") ||
    new URLSearchParams(window.location.search).get("sw") === "off";

  if (refused) {
    void navigator.serviceWorker
      .getRegistrations()
      .then(registrations =>
        Promise.all(
          registrations
            .filter(registration => registration.active?.scriptURL.endsWith("/sw.js") || registration.scope === window.location.origin + "/")
            .map(registration => registration.unregister()),
        ),
      )
      .catch(() => {
        /* Nothing to clean up. */
      });
    return;
  }

  navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch(() => {
    /* Offline support stays unavailable; the app still works online. */
  });
}
