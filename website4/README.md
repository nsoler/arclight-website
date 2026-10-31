# ArclightVFX — Make Every Frame Hit

Loud anime-inspired marketing direction with neon pink, yellow and cyan, bold typography, manga panels, speed lines and an original SVG city/portal illustration. Includes the source-reviewed product features, geometry node filters, interactive compositor demo and scripting tabs.

From the parent directory:

```sh
npm install
npm run dev:4
npm run build:4
npm run start:4
```

Inside this folder use `npm run dev`, `npm run build` or `npm start`.

`vite.config.js` enables network access for development and preview with `host: '0.0.0.0'`, `allowedHosts: true`, port `4000` and `strictPort: true`. Open `http://<server-IP>:4000` from a reachable machine. Run one of the four sites at a time because they share the port. Vite uses the JavaScript configuration file; no `vite.config.json` is needed.

The production build is in `dist/`. Upload its contents, including `.htaccess`, to Apache hosting; relative asset paths support domain-root or subfolder hosting. See `deployment.md`. These settings do not configure network routing or a firewall.

Feature evidence and limitations: [FEATURES.md](../FEATURES.md).
