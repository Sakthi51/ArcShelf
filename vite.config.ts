import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { copyFileSync, mkdirSync, existsSync, readdirSync } from 'fs'

function copyPublicPlugin() {
  return {
    name: 'copy-public',
    closeBundle() {
      const dist = resolve(__dirname, 'dist')
      const pub = resolve(__dirname, 'public')
      copyFileSync(resolve(pub, 'manifest.json'), resolve(dist, 'manifest.json'))
      const iconsDir = resolve(pub, 'icons')
      const distIcons = resolve(dist, 'icons')
      if (existsSync(iconsDir)) {
        if (!existsSync(distIcons)) mkdirSync(distIcons, { recursive: true })
        for (const file of readdirSync(iconsDir)) {
          if (file.endsWith('.png')) {
            copyFileSync(resolve(iconsDir, file), resolve(distIcons, file))
          }
        }
      }
    },
  }
}

export default defineConfig({
  plugins: [react(), copyPublicPlugin()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  build: {
    rollupOptions: {
      input: {
        content: resolve(__dirname, 'src/content/index.tsx'),
        background: resolve(__dirname, 'src/background/index.ts'),
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: 'chunks/[name]-[hash].js',
        assetFileNames: (info) => {
          if (info.name === 'style.css') return 'content.css'
          return '[name].[ext]'
        },
      },
    },
    outDir: 'dist',
    emptyOutDir: true,
    cssCodeSplit: false,
  },
  base: './',
})
