import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import sveltePreprocess from 'svelte-preprocess'
import { resolve } from 'path'

const root = resolve( __dirname, 'src' )
const outDir = resolve( __dirname, 'dist' )

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    svelte({
      preprocess: [sveltePreprocess({ scss: true })],
    })
  ],
  resolve: {
    alias: {
      '@ccpdata': resolve( root, 'ccpdata' ),
      '@utils': resolve( root, 'lib', 'utils' ),
      '@lib': resolve( root, 'lib' ),
      '@src': root
    },
  },
  root,
  build: {
    outDir,
    emptyOutDir: true
  },
  optimizeDeps: {
    exclude: ['torino']
  },
  publicDir: '../public'
})
