import fs from 'node:fs'
import path from 'node:path'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// Runs the same /api code locally (npm run dev / npm run preview) that Vercel runs online.
const localApi = () => {
  const mount = (app) => {
    app.use(async (req, res, next) => {
      const url = req.url || ''
      try {
        if (url.startsWith('/api/')) {
          const { default: handler } = await import('./server/router.js')
          return handler(req, res)
        }
        // Local-only: serve images uploaded in the admin panel while developing
        if (url.startsWith('/uploads/') && !process.env.BLOB_READ_WRITE_TOKEN) {
          const file = path.join(process.cwd(), '.local-data', 'uploads', path.basename(url.split('?')[0]))
          if (fs.existsSync(file)) {
            res.setHeader('Content-Type', file.endsWith('.pdf') ? 'application/pdf' : 'image/' + path.extname(file).slice(1).replace('jpg', 'jpeg'))
            return fs.createReadStream(file).pipe(res)
          }
        }
      } catch (err) {
        console.error(err)
        res.statusCode = 500
        return res.end('Server error')
      }
      next()
    })
  }
  return {
    name: 'local-api',
    configureServer: (server) => mount(server.middlewares),
    configurePreviewServer: (server) => mount(server.middlewares),
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  // Make .env values (ADMIN_USERNAME, SESSION_SECRET ...) available to the local API
  for (const [key, value] of Object.entries(env)) {
    if (process.env[key] === undefined) process.env[key] = value
  }

  // Your live domain. Set VITE_SITE_URL in Vercel (recommended, e.g. https://yourname.com).
  // If it is not set, Vercel's production URL is used automatically.
  const siteUrl = (
    env.VITE_SITE_URL ||
    process.env.VITE_SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : '')
  ).replace(/\/$/, '')

  const seoFiles = () => ({
    name: 'seo-files',

    // Replaces __SITE_URL__ inside index.html (canonical, og:image, JSON-LD ...)
    transformIndexHtml: (html) => html.replaceAll('__SITE_URL__', siteUrl),

    // Creates robots.txt and sitemap.xml inside the build output
    generateBundle() {
      if (!siteUrl) {
        this.warn(
          'SITE URL not set: sitemap.xml was skipped. Set VITE_SITE_URL (e.g. https://yourdomain.com).'
        )
        this.emitFile({
          type: 'asset',
          fileName: 'robots.txt',
          source: 'User-agent: *\nAllow: /\nDisallow: /api/\n',
        })
        return
      }

      const today = new Date().toISOString().slice(0, 10)
      const pages = [
        { path: '/', priority: '1.0' },
        { path: '/projects', priority: '0.8' },
      ]

      const sitemap =
        '<?xml version="1.0" encoding="UTF-8"?>\n' +
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
        pages
          .map(
            (p) =>
              `  <url>\n    <loc>${siteUrl}${p.path}</loc>\n    <lastmod>${today}</lastmod>\n    <priority>${p.priority}</priority>\n  </url>`
          )
          .join('\n') +
        '\n</urlset>\n'

      this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: sitemap })
      this.emitFile({
        type: 'asset',
        fileName: 'robots.txt',
        source: `User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${siteUrl}/sitemap.xml\n`,
      })
    },
  })

  return {
    plugins: [react(), seoFiles(), localApi()],
    define: {
      'import.meta.env.SITE_URL': JSON.stringify(siteUrl),
    },
  }
})
