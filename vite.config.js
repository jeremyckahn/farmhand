import { defineConfig, transformWithEsbuild } from 'vite'
import react from '@vitejs/plugin-react'

export default () => {
  return defineConfig({
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
}
