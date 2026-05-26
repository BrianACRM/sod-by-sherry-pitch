import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/sod-by-sherry-pitch/',
  plugins: [react()],
})
