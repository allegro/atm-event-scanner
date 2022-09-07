import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            includeAssets: ['logo.svg', 'apple-touch-icon.png'],
            manifest: {
                name: 'ATM Ticket Scanner',
                short_name: 'ATM Scanner',
                description: 'ATM Ticket Scanner',
                theme_color: '#ffffff',
                icons: [
                    {
                        src: 'logo.svg',
                        sizes: 'any',
                        type: 'image/svg+xml'
                    }
                ]
            }
        })
    ]
})