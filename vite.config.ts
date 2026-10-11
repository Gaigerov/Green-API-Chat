import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'
import type { IncomingMessage, ServerResponse } from 'node:http'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'green-api-proxy',
      apply: 'serve',
      configureServer(server) {
        server.middlewares.use(
          '/api/green-api-proxy',
          async (req: IncomingMessage, res: ServerResponse) => {
            const url = req.url ?? '/'
            const withoutLeadingSlash = url.startsWith('/') ? url.slice(1) : url
            const slashIdx = withoutLeadingSlash.indexOf('/')
            const host = slashIdx === -1
              ? withoutLeadingSlash
              : withoutLeadingSlash.slice(0, slashIdx)
            const rest = slashIdx === -1 ? '' : withoutLeadingSlash.slice(slashIdx)

            if (!host || !host.includes('green-api.com')) {
              res.statusCode = 400
              res.end('Invalid proxy target')
              return
            }

            const targetUrl = `https://${host}${rest}`

            try {
              const chunks: Buffer[] = []
              await new Promise<void>((resolve, reject) => {
                req.on('data', (chunk: Buffer) => chunks.push(chunk))
                req.on('end', resolve)
                req.on('error', reject)
              })
              const body = chunks.length > 0 ? Buffer.concat(chunks) : undefined

              const headers: Record<string, string> = {
                'content-type': (req.headers['content-type'] as string) || 'application/json',
              }

              const upstream = await fetch(targetUrl, {
                method: req.method,
                headers,
                body: body && body.length > 0 ? body : undefined,
                signal: AbortSignal.timeout(20000),
              })

              res.statusCode = upstream.status
              const ct = upstream.headers.get('content-type')
              if (ct) res.setHeader('content-type', ct)
              const text = await upstream.text()
              res.end(text)
            } catch (err) {
              res.statusCode = 502
              res.end(JSON.stringify({ error: String(err) }))
            }
          }
        )
      },
    },
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: '0.0.0.0',
    port: parseInt(process.env.PORT || '8443'),
    strictPort: true,
  },
  preview: {
    host: '0.0.0.0',
    port: parseInt(process.env.PORT || '8443'),
  },
})
