import { fileURLToPath, URL } from 'url'
import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import sveltePreprocess from 'svelte-preprocess'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    svelte({
      preprocess: [sveltePreprocess({ scss: true })]
    })
  ],
  resolve: {
    alias: {
      '@ccpdata': fileURLToPath(new URL('./src/ccpdata', import.meta.url)),
      '@utils': fileURLToPath(new URL('./src/lib/utils', import.meta.url)),
    },
  },
})
