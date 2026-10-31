# ArclightVFX website

A one-page Vite site introducing the ArclightVFX Compositor (`../arclight`) to
effects artists, with a modern graphite and green look and subtle anime influences.

The GPU section reflects the documented 0.12.0 foundation release: adapter
setup, controls, and self-tests; node acceleration is still on the roadmap.

```sh
npm install
npm run dev       # http://localhost:4000
npm run build     # -> dist/
npm start
```

- `index.html`: page structure and static sections
- `src/data.js`: node catalog, "special moves", code samples (edit content here)
- `src/dojo.js`: the in-browser toy compositor (float linear, premultiplied)
- `src/main.js`: background, tabs, scroll reveals
- `src/style.css`: theme tokens at the top

## Deploying to Bluehost (FTP)

1. `npm run build`: produces `dist/` (includes `.htaccess` from `public/`).
2. Upload the **contents** of `dist/` (not the folder itself) into
   `public_html/` (or the addon domain's / subfolder's document root).
   Make sure hidden files are shown so `.htaccess` gets uploaded.
3. Turn on the free SSL certificate in Bluehost so the HTTPS redirect works.

Asset paths are relative (`base: './'` in `vite.config.js`), so the site
also works from a subfolder.

Network access: dev listens on `0.0.0.0:4000`, `npm start` on `0.0.0.0:4000`, and both accept all hostnames. From another machine, use this computer’s LAN IP or hostname in the URL. Restart the server after configuration changes.
