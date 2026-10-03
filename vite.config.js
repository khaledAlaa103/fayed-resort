import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { defineConfig } from 'vite'
import { fayedDbPlugin } from './server/vite-db-plugin.js'

export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    fayedDbPlugin(),
  ],
  build: {
    target: 'chrome108',
    outDir: 'dist',
    emptyOutDir: true,
  },
})
