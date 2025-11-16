import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
// import { cloudflare } from '@cloudflare/vite-plugin'

// https://vitejs.dev/config/
export default defineConfig({
  server:{
    cors:false
  },
  plugins: [
    // cloudflare({ viteEnvironment: { name: 'ssr' } }),
    TanStackRouterVite({ autoCodeSplitting: true }),
    viteReact(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
})
