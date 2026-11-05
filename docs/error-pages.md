# TMIS error pages

Open `app/errors/404.html`, `app/errors/500.html`, or `app/errors/maintenance.html` through your existing TMIS web server. Each is standalone HTML with inline CSS, SVG, and optional navigation JavaScript; no CDN, font download, or authentication is required.

Edit the shared design and copy in `scripts/build-error-pages.mjs`, then run `node scripts/build-error-pages.mjs` to regenerate the three checked-in pages.

## Server behavior

The optional Node backend returns the designed 404 for missing pages and 500 for unexpected page-serving failures. API errors retain JSON responses. Set `TMIS_MAINTENANCE=true` and restart the Node server to enable maintenance; unset it and restart to restore access. Maintenance sends HTTP 503, `Retry-After: 300` (a retry interval, not an estimated completion time), and `Cache-Control: no-store`. It blocks API requests as well as page requests. Maintenance is off by default.

Direct visits to the HTML files are previews with status 200. They do not cause an outage or simulate a server failure. The existing Vite build only builds its root entry; these standalone pages are served from the source checkout by XAMPP or the Node backend.

For Apache/XAMPP, configure local error documents in the virtual host or an allowed `.htaccess`, adjusting the prefix to your actual installation:

```apache
ErrorDocument 404 /TMISv1/app/errors/404.html
ErrorDocument 500 /TMISv1/app/errors/500.html
ErrorDocument 503 /TMISv1/app/errors/maintenance.html
```

Apache must internally serve these documents (not redirect). For arbitrary missing URL depths, supply the actual installation prefix in the generated page's `serverBase` constant and replace its relative sign-in links with `/TMISv1/app/authentication/login.html` before using Apache ErrorDocument. Apache maintenance routing is a separate server setting: configuring an ErrorDocument does not enable maintenance. No Apache configuration has been changed automatically.

## Design research

- [One Page Love: 404 examples](https://onepagelove.com/404s) — brand-specific visuals and clear routes back.
- [Creative Bloq: 404 inspiration](https://www.creativebloq.com/web-design/best-404-pages-812505) — expressive typography and illustration.
- [Creative Tim: TikTok-linked error-page tutorial](https://www.creative-tim.com/blog/tiktok-learning/tiktok-tutorial-76-how-to-create-error-page/) — large error-code composition. Published in 2023; not evidence of a current TikTok trend.

TMIS uses its existing forest-green palette, warm background, serif accents, and a different illustration for each state. Copy avoids invented restoration times, progress percentages, incident reports, and guarantees that unsaved work is safe.
