/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  server: {
      // Dev server is reached from other machines (LAN / Tailscale); Vite only allows localhost by default.
      host: true,
    allowedHosts: ['pc', '.local', '.ts.net'],
      cors: { origin: /^https?:\/\/(localhost|pc(\.local)?|127\.0\.0\.1|\[::1\]|192\.168\.\d+\.\d+|100\.\d+\.\d+\.\d+|[a-z0-9-]+(\.[a-z0-9-]+)*\.ts\.net)(:\d+)?$/ },
  },
  plugins: [react(), tailwindcss()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test-setup.ts',
  },
})
