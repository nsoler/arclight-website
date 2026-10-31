import { defineConfig } from 'vite'

export default defineConfig({
  // Relative asset URLs so dist/ works both at a domain root (public_html/)
  // and in a subfolder (public_html/arclight/) on shared hosting.
  base: './',
  server: {
    host: '0.0.0.0',
  },
  preview: {
    host: '0.0.0.0',
    port: 4173,
    strictPort: true,
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
})
