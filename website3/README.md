# ArclightVFX — Beyond the Frame

Independent Vite site with a futuristic cyan and violet control-room design.

From this folder: `npm install`, `npm run dev`, `npm run build`, `npm start`.
From the collection root: `npm run dev:3` or `npm run build:3`.

Content: `index.html` and `src/data.js`. Styling: `src/style.css`.
The original interactive compositor, catalog filters, and scripting examples are retained.
The hero illustration is original inline SVG; it requires no remote image service.
Google Fonts are optional; system font fallbacks are provided.

Upload the contents of `dist/`, including the hidden `.htaccess`, to your Apache hosting document root.
See the collection's root README for deployment instructions.

Network access: dev listens on `0.0.0.0:4000`, `npm start` on `0.0.0.0:4000`, and both accept all hostnames. From another machine, use this computer’s LAN IP or hostname in the URL. Restart the server after configuration changes.
