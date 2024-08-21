import { defineConfig, transformWithEsbuild, mergeConfig } from 'vite'
import { defineConfig as vitestDefineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

const viteConfig = defineConfig({
  plugins: [
    react(),
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
  ],
  resolve: {
    alias: [
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
})

const vitestConfig = vitestDefineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
    restoreMocks: true,
    coverage: {
      reporter: ['text', 'html'],
      exclude: ['node_modules', 'src/setupTests.js', 'dist', 'src/__mocks__'],
    },
  },
})

export default mergeConfig(viteConfig, vitestConfig)
