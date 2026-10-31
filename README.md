# ArclightVFX — four design directions

- **website1** — the original charcoal, teal, cream and lime site.
- **website2** — The Creative Chapter: anime-inspired landscape illustration, cherry blossoms, warm paper, ink borders, coral accents and manga panels.
- **website3** — Beyond the Frame: dark technical grid, cyan and violet accents, animated orbital core and instrument-panel layouts.
- **website4** — Break the Frame: loud anime styling, neon pink/yellow/cyan, heavy ink, speed lines and an original portal/city illustration.

All four are standalone Vite projects and retain the interactive node compositor, node catalog filters, scripting examples, and release links. Product content reflects the inspected Arclight 0.13.21 development source, including GPU rendering paths and procedural geometry. Public release builds may differ. See [FEATURES.md](FEATURES.md) for the feature inventory, artist benefits and source references.

## Run locally

From this directory:

```sh
npm install
npm run dev:1
npm run dev:2
npm run dev:3
npm run dev:4
npm run build
```

Run one site at a time; all sites use port 4000. Stop the current server with Ctrl+C before starting another site. `npm run build` builds all four sites. Use `npm run build:2`, for example, to build only website2.

Each folder also works independently with `npm install`, `npm run dev`, `npm run build` and `npm start`.

To review a built site, run `npm run start:1`, `npm run start:2`, or `npm run start:3`, or `npm run start:4` from this directory. Inside any website folder, run `npm start`. This uses Vite preview to serve that site's existing `dist/`; run `npm run build` first when source changes. Root `npm start` selects website1.

## Access from another machine

All four development and preview servers listen on `0.0.0.0` and accept all hostnames. Restart any running servers after pulling these changes.

| Site | Start development | Development port | Preview port |
| --- | --- | --- | --- |
| website1 | `npm run dev:1` | 4000 | 4000 |
| website2 | `npm run dev:2` | 4000 | 4000 |
| website3 | `npm run dev:3` | 4000 | 4000 |
| website4 | `npm run dev:4` | 4000 | 4000 |

From another machine, visit `http://<server-LAN-IP>:4000`. Use the server computer's actual IP or hostname, not `127.0.0.1` or `0.0.0.0`, in the browser. For production-build previews, run `npm start` inside the desired website folder after building it.

If the connection still times out, the server computer's firewall must allow the selected TCP ports and both machines need a reachable network connection. Internet access also requires routing or port forwarding on your network. These Vite settings do not change Apache hosting configuration.

## Deploy to Apache hosting / Bluehost

1. Build the desired site, or use the supplied build in its `dist/` folder.
2. Upload **the contents** of that site's `dist/` to the domain's document root (usually `public_html/`) or to a subfolder. Each design has its own `dist`; choose one per destination.
3. Include the hidden `.htaccess`. The source lives in each site's `public/.htaccess`, so Vite restores it on every build.
4. Enable the host's SSL certificate before visiting: `.htaccess` redirects HTTP to HTTPS.

The Apache configuration disables directory listings, compresses supported files, caches hashed assets, revalidates HTML, and sets basic response headers. It requires Apache with the relevant AllowOverride permissions; it is not an Nginx configuration. These are single-page anchor-based websites, so no client-side route fallback is needed. Vite uses relative asset paths (`base: './'`) for domain-root and subfolder deployment.

To show all four, upload each build's contents to separate directories such as `public_html/website1/`, `public_html/website2/`, and `public_html/website3/`. Do not upload source, node_modules or package files.

Fonts load from Google Fonts with local system-font fallbacks. All illustrations, icons, CSS and JavaScript ship in the builds.
