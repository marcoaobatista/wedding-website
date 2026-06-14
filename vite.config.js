import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // Served from the apex custom domain carysandmarco.com at the root,
  // so the base path is '/' (Vite's default). A CNAME file in public/
  // keeps GitHub Pages pinned to the custom domain across deploys.
  base: '/',
  plugins: [react()],
})
