import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    allowedHosts: [
      'b734-2404-1c40-481-d393-2518-d5f5-559f-8ed.ngrok-free.app' // Add your ngrok URL here
    ]
  }
})
