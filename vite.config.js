import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  // Served from the apex custom domain carysandmarco.com at the root,
  // so the base path is '/' (Vite's default). A CNAME file in public/
  // keeps GitHub Pages pinned to the custom domain across deploys.
  base: '/',
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        saveTheDate: resolve(__dirname, 'save-the-date/index.html'),
        faq: resolve(__dirname, 'faq/index.html'),
      },
    },
  },
})
