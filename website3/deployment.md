# Deploying to Bluehost

The site is plain static files (no server-side code), so any Bluehost shared
plan works. Uploads are done over FTP/SFTP.

## Project files involved

- `vite.config.js`: `base: './'` makes all asset links relative, so the site
  works at the domain root (`public_html/`) or in a subfolder.
- `public/.htaccess`: Apache settings, copied into `dist/` on every build. It:
  - redirects http to https
  - compresses HTML/CSS/JS/SVG
  - caches the hashed files in `assets/` for a year; `index.html` is always
    revalidated so updates show up right away
  - disables directory listings
  - adds basic security headers

## Steps

1. **Build** (repeat after every change):

   ```sh
   npm run build
   ```

   Output:

   ```
   dist/
   ├── .htaccess
   ├── index.html
   ├── arclight-icon.svg
   └── assets/  (index-xxxx.js, index-xxxx.css)
   ```

2. **Point the domain at Bluehost.** If the domain is registered elsewhere, set
   its nameservers to `ns1.bluehost.com` and `ns2.bluehost.com`. Changes can
   take a few hours to take effect.

3. **Get FTP details.** In the Bluehost control panel go to **Hosting → FTP**
   (or cPanel → FTP Accounts). Note the host (usually `ftp.yourdomain.com` or
   the server IP), username, password and port 21. Prefer **SFTP on port 22**
   with the cPanel login if available, since it's encrypted.

4. **Upload with an FTP client such as FileZilla:**
   - Connect and open `public_html/` (the main domain's root; addon domains and
     subdomains have their own folders).
   - Delete Bluehost's default placeholder files there (e.g. `default.html`,
     `index.php`) if present.
   - Upload the **contents** of `dist/`, not the `dist` folder itself.
   - Turn on hidden files first (FileZilla: *Server → Force showing hidden
     files*), otherwise `.htaccess` is skipped.

5. **Enable SSL.** In Bluehost go to **Security → SSL Certificates** (or
   *My Sites → Manage → Security*) and turn on the free Let's Encrypt
   certificate. Do this before relying on the https redirect, or visitors
   will see a certificate warning.

6. **Check it.** Open `https://yourdomain.com`. If you get a 500 error,
   temporarily rename `.htaccess` on the server to see whether it's the cause.

## Updating the site

Run `npm run build` and upload the contents of `dist/` again. File names in
`assets/` change on every build, so delete the old `assets/` files on the
server to keep it tidy.
