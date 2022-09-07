import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    base: "https://allegro.github.io/atm-event-scanner/",
    plugins: [
        react()
    ]
})