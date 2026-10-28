# Started-lives counter

The public welcome page counts accepted lives from installation onward. It does not count previews, rerolls or resuming a saved life, and cannot recover earlier lives. This is not a count of unique players. The browser generates a random identifier per life; names and life events are not sent. If the network fails, pending events retry when browser storage is available. Repeated submissions for the same ID are idempotent.

The static game calls a separate Cloudflare Worker at `https://fantasy-life-birth-counter.prompt-buddy-cloudflare.workers.dev/api/births`. `worker.mjs` is the Worker source and `schema.sql` defines its D1 table (`DB` binding). The client is `dist/birth-counter.js`, integrated via `client-manifest.json`. Keep production account IDs and credentials outside the repository. Configure a D1 binding when deploying the Worker and apply the schema separately before serving requests.

This public engagement metric is approximate: requests can be forged or automated. Consider platform rate limiting and bot protection if abuse becomes a problem. Local contract tests run with `node counter/test.mjs`; they do not establish production load capacity.
