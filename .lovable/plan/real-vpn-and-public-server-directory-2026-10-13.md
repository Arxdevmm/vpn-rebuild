# Real VPN and public server directory

## What changes
- Preserve the steel-and-copper interface and mechanical meters.
- Replace demo-node browsing with a public-directory view, source attribution, refresh/error states, location filters, and sorting. Missing location stays “Unknown”; latency stays “Unmeasured” until tested through the native client.
- Add personal star ratings stored on the device, clearly separate from community ratings.
- Keep the browser preview explicitly simulated. Do not claim that settings protect browser or device traffic.

## Native Android dependency
Lovable supports the web client, not building or testing a native Android VPN service. Real tunneling requires an externally developed Android companion with Xray and a TUN adapter. This plan does not promise an APK or working native tunnel from the web project.

The Android companion must implement:
- Android VPN consent, foreground service lifecycle, IPv4/IPv6 TUN capture, protected upstream sockets, and TCP/UDP forwarding through Xray.
- DNS capture and resolver configuration; direct/block/proxy routing with required GeoIP/GeoSite assets.
- Fail-closed behavior while reconnecting, plus Android always-on VPN and “Block connections without VPN” for protection when the app/service stops. A web toggle alone is not a Kill Switch.
- Real session byte counters and end-to-end latency probes through each selected server. The odometers consume these counters, never random values in native mode.
- Explicit handling of the conflict between bypass rules and lockdown: traffic excluded from the VPN can be blocked by Android lockdown.

## Public-server safety
- Public server operators are not trusted or verified; label them accordingly and do not connect automatically.
- Use a reviewed, attributed public subscription source with supported configurations; show partial-import errors and source freshness.
- Evaluate [FastNodes](https://github.com/rtwo2/FastNodes) and [free-v2ray-public-list](https://github.com/ebrasha/free-v2ray-public-list) as candidate sources; verify their current format, license, and availability before choosing. Inclusion is not a safety endorsement.
- Parse links locally and never send server credentials to AI or analytics.
- Do not invent locations from server names or use server-side/browser HTTP response times as device tunnel latency.

## Technical implementation
- Keep the existing TanStack web app; do not replace its framework or add a native project inside it.
- Isolate directory ingestion, sorting, ratings, and a typed native-adapter contract from presentation and protocol export.
- Until the external service exists, native operations report “unavailable,” rather than silently falling back to simulated protection.
- Stop telemetry updates on disconnect and discard stale events from previous sessions.

## Verification and delivery
- Web tests: directory parsing, unsupported entries, missing measurements, sorting/filtering, rating persistence, and source failures.
- Preview checks: browsing, import, ratings, all tabs, and clear simulation labels.
- Android acceptance checks are blocked until the companion and a physical device are available: real exit IP, DNS leaks, IPv6, disconnect/crash/reboot lockdown, bypass rules, and actual byte counters.
- Deliver the web directory and integration contract separately from the external Android work; clearly list what remains unavailable.