# Live world statistics

The game shows two counters below its header on the welcome, birth and gameplay screens. They update through a Cloudflare WebSocket, without reloading or interrupting the simulation.

**Online now** counts visible, connected browser identities. A random UUID stored in localStorage lets multiple tabs in one browser count once; another device/browser counts separately. No account, names, species or life stories are sent. Closing the last visible tab removes that browser. Hidden tabs are excluded while another visible sibling keeps it online. Abrupt disconnections can take up to about 105 seconds to disappear (75-second heartbeat expiry, 30-second cleanup). This is an approximate active-browser count, not a verified unique-person metric.

**Lives started** counts accepted lives from the original installation onward, preserving the existing D1 records. Previews, rerolls and resuming a saved life are excluded. Random life IDs make retries idempotent; pending starts retry when localStorage/network access returns. Earlier unrecorded history cannot be reconstructed. Public anonymous requests can be automated, so this is an engagement metric rather than an audited population count.

## Backend

`worker.mjs` serves `https://fantasy-life-birth-counter.prompt-buddy-cloudflare.workers.dev`:

- `GET /api/births`: original cumulative count.
- `POST /api/births`: accepts exactly `{lifeId: UUIDv4}`; preserves D1 insertion deduplication and pushes the new total.
- `GET /api/stats`: fallback snapshot `{type:'stats', online, total, updatedAt}`.
- WebSocket `/api/live?visitor=UUIDv4&visible=1`: sends snapshots and receives `{type:'heartbeat'|'visibility', visible:boolean}`. Heartbeat is every 25 seconds.

`DB` points to the original D1 database; apply `schema.sql` only when initializing a NEW database. Do not reset the production table during updates. `LIVE_STATS` binds to the `LiveStats` Durable Object, id `global`. Online presence is transient; cumulative lives remain in D1. `wrangler.example.toml` documents the configuration without credentials. Keep real account credentials outside Git. A shared Durable Object currently caps 5,000 WebSocket connections; no large-player load capacity is claimed or tested.

The client is `dist/birth-counter.js`, bundled by `client-manifest.json`. The statbar remains outside the rerendered gameplay panel. WebSocket reconnection uses backoff; disconnected users see unavailable online counts and can fall back to periodic HTTP updates. Thai and English labels follow the game language.

## Verification

```
node counter/test.mjs
node --test counter/live-stats.test.mjs
NODE_PATH=/opt/codex/runtimes/cua/lib/node_modules node counter/browser-test.cjs
```

The browser check expects the game on `http://127.0.0.1:8765`. Its API and WebSocket traffic is mocked, so testing acceptance never adds fake production lives. Live Cloudflare verification separately checked deduplication, another visitor, visibility and heartbeat without submitting births.
