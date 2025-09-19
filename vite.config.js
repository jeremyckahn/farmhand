import fs from 'node:fs'

import { defineConfig, transformWithEsbuild, mergeConfig } from 'vite'
import { defineConfig as vitestDefineConfig } from 'vitest/dist/config.js'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

import { manifest } from './manifest.js'

// NOTE: See:
//   - https://stackoverflow.com/a/78012267/470685
//   - https://www.codu.co/articles/converting-an-image-to-a-data-uri-string-in-node-js-dznt83ha
const dataUriLoader = {
  name: 'dataUri-loader',
  transform(_, id) {
    const [path, query] = id.split('?')
    if (query !== 'dataUri') return null

    const data = fs.readFileSync(path)

    // convert binary data to base64 encoded string
    const base64Image = Buffer.from(data).toString('base64')

    // Get image file extension
    const ext = path.split('.').pop()

    // complete data URI
    const uri = `data:image/${ext};base64,${base64Image}`

    return `export default '${uri}';`
  },
}

const viteConfig = defineConfig({
  build: {
    sourcemap: true,
  },
  preview: {
    allowedHosts: true,
  },
  plugins: [
    react(),
    // FIXME: Don't merge this. It's an experimental fix.
    //
    // VitePWA({
    //   registerType: 'prompt',
    //   devOptions: {
    //     enabled: false,
    //   },
    //   injectRegister: 'auto',
    //   filename: 'service-worker.js',
    //   manifest,
    // }),
    // NOTE: This makes Vite treat .js files as .jsx (for legacy support)
    // See: https://stackoverflow.com/a/76458411/470685
    {
      name: 'load+transform-js-files-as-jsx',
      async transform(code, id) {
        if (!id.match(/src\/.*\.js$/)) {
          return null
        }

        // Use the exposed transform from vite, instead of directly
        // transforming with esbuild
        return transformWithEsbuild(code, id, {
          loader: 'jsx',
          jsx: 'automatic',
        })
      },
    },
    dataUriLoader,
  ],
  resolve: {
    alias: [
      {
        find: /^trystero$/,
        replacement: `trystero/torrent`,
      },
      {
        // NOTE: This is required for the SCSS modules
        find: /^~(.*)$/,
        replacement: '$1',
      },
    ],
  },
  define: {
    // NOTE: By default, Vite doesn't include shims for NodeJS.
    global: {},
  },
  // NOTE: This makes Vite treat .js files as .jsx (for legacy support)
  // See: https://stackoverflow.com/a/76458411/470685
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    },
  },
  css: {
    preprocessorOptions: {
      sass: {
        api: 'modern-compiler', // or "modern"
      },
    },
  },
})

const vitestConfig = vitestDefineConfig({
  test: {
    watch: false,
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
    restoreMocks: true,
    dir: 'src',
    coverage: {
      reporter: ['text', 'html'],
      exclude: ['node_modules', 'src/setupTests.js', 'dist', 'src/__mocks__'],
    },
  },
})

export default mergeConfig(viteConfig, vitestConfig)
