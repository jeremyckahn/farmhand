import fs from 'node:fs'

import { defineConfig, transformWithEsbuild, mergeConfig } from 'vite'
import { defineConfig as vitestDefineConfig } from 'vitest/config'
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
  legacy: {
    // NOTE: Restores Vite 7 CJS/ESM interop behavior for file extension imports from MUI/icons
    // (e.g. `@mui/icons-material/*.js` or `@mui/material/*/index.js`) to prevent them from
    // being imported as `{ default: Component }` namespace objects in Vite 8.
    inconsistentCjsInterop: true,
  },
  build: {
    sourcemap: true,
  },
  preview: {
    allowedHosts: true,
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt',
      devOptions: {
        enabled: false,
      },
      injectRegister: 'auto',
      filename: 'service-worker.js',
      manifest,
      workbox: {
        // The main bundle crossed workbox's default 2 MiB precache limit
        // after upgrading to React 18 and react-markdown v10 (whose
        // unified/remark-based dependency tree is much larger than v4's),
        // and again after adding @jeremyckahn/farmhand-shuffle (which pulls
        // in its own react-router-dom/xstate/etc. dependency tree). Raise
        // the limit rather than leave the asset stale/un-precached; revisit
        // with code-splitting if the bundle keeps growing.
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
      },
    }),
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
  define: {
    // NOTE: By default, Vite doesn't include shims for NodeJS.
    global: {},
  },
  // NOTE: This makes Vite treat .js files as .jsx (for legacy support)
  // See: https://stackoverflow.com/a/76458411/470685
  optimizeDeps: {
    rolldownOptions: {
      moduleTypes: {
        '.js': 'jsx',
      },
    },
  },
})

const vitestConfig = vitestDefineConfig({
  test: {
    watch: false,
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
    restoreMocks: true,
    dir: 'src',
    server: {
      deps: {
        // @jeremyckahn/farmhand-shuffle's dist-lib bundle uses deep,
        // extensionless MUI import paths (e.g. `@mui/material/Button`),
        // which are valid for a bundler's resolution but not for Node's
        // native ESM loader. Vitest externalizes node_modules packages by
        // default (loading them via Node directly instead of through
        // Vite's transform pipeline), which breaks on those imports.
        // Inlining this package routes it through Vite's resolver instead.
        inline: [/@jeremyckahn\/farmhand-shuffle/],
      },
    },
    coverage: {
      reporter: ['text', 'html'],
      exclude: ['node_modules', 'src/setupTests.ts', 'dist', 'src/__mocks__'],
    },
  },
})

export default mergeConfig(viteConfig, vitestConfig)
