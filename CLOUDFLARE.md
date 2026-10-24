# Cloudflare Pages

The game is a static, browser-local application. No Worker, database, paid API, or game-server deployment is required. Publish the contents of `dist/`.

Build the current client and prepare a Direct Upload package:

```sh
python scripts/build-client.py
python scripts/package-pages.py /absolute/path/one-in-10-billion-fantasy-cloudflare.zip
```

In the authenticated Cloudflare Dashboard, create a Pages project using Direct Upload, select the ZIP and deploy. Suggested project name: `one-in-10-billion-fantasy` (subject to availability). A `pages.dev` URL exists only after Cloudflare confirms deployment; preparing the ZIP does not reserve a name or publish it.

For an existing Pages project with Wrangler authenticated locally:

```sh
npx wrangler pages deploy dist --project-name one-in-10-billion-fantasy
```

The ZIP has `index.html` at its root and includes `_headers` for cache policy and CSP. Fingerprinted assets use immutable caching; the HTML revalidates. Game turns and animations execute on the player's device. No measured concurrency guarantee is implied.

Browser saves are scoped to each site origin. Export a JSON save from the existing game before switching domains, then import it on the new site.
