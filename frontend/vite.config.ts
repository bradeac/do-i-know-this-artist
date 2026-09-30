
import os from 'node:os';/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Host name the browser uses for this machine.
const hostShort = os.hostname().replace(/\..*$/, '');

export default defineConfig({
  server: {
      // Dev server is reached from other machines (LAN / Tailscale); Vite only allows localhost by default.
      host: true,
    // /api → backend, so the browser calls relative /api (like the prod build) and it works from any device.
    // docker-compose sets API_PROXY_TARGET=http://backend:5000; running vite directly uses the published port.
    proxy: { '/api': process.env.API_PROXY_TARGET || 'http://localhost:5177' },
    allowedHosts: ['.local', '.ts.net', hostShort],
      cors: { origin: new RegExp(`^https?://(localhost|${hostShort}|${hostShort}\\.local|127\\.0\\.0\\.1|\\[::1\\]|192\\.168\\.\\d+\\.\\d+|100\\.\\d+\\.\\d+\\.\\d+|[a-z0-9-]+(\\.[a-z0-9-]+)*\\.ts\\.net)(:\\d+)?$`) },
  },
  plugins: [react(), tailwindcss()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test-setup.ts',
  },
})
