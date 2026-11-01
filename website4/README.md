# ArclightVFX — Make Every Frame Hit

Loud anime-inspired marketing direction with neon pink, yellow and cyan, bold typography, manga panels, speed lines and an original SVG city/portal illustration. Includes the source-reviewed product features, geometry node filters, interactive compositor demo and scripting tabs.

From the parent directory:

```sh
npm install
npm run dev:4
npm run build:4
npm run start:4
```

Inside this folder use `npm run dev`, `npm run build`, `npm run typecheck` or `npm start`.

The source is TypeScript (`src/*.ts`, configured by `tsconfig.json`). `npm run build` first type-checks with `tsc` (it stops on any type error), then Vite compiles everything to plain, minified JavaScript in `dist/`. The dev server compiles TypeScript on the fly but does not type-check, so run `npm run typecheck` (or rely on your editor) while working.

`vite.config.ts` enables network access for development and preview with `host: '0.0.0.0'`, `allowedHosts: true`, port `4000` and `strictPort: true`. Open `http://<server-IP>:4000` from a reachable machine. Run one of the four sites at a time because they share the port. Vite reads the TypeScript configuration file directly; no `vite.config.json` is needed.

The production build is in `dist/`. Upload its contents, including `.htaccess`, to Apache hosting; relative asset paths support domain-root or subfolder hosting. See `deployment.md`. These settings do not configure network routing or a firewall.

Feature evidence and limitations: [FEATURES.md](../FEATURES.md).
