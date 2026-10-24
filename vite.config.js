import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Mi Clima',
        short_name: 'Clima',
        description: 'Aplicación sencilla para consultar el clima',
        start_url: '/',
        display: 'standalone',
        background_color: '#eaf4ff',
        theme_color: '#4b8fe2',
        icons: [
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png' }
        ]
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.open-meteo\.com\/v1\/forecast/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'datos-clima',
              expiration: { maxEntries: 10, maxAgeSeconds: 86400 }
            }
          }
        ]
      }
    })
  ]
})
