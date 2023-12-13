import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default () => {
  return defineConfig({
    plugins: [react()],
    resolve: {
      alias: [
        {
          // this is required for the SCSS modules
          find: /^~(.*)$/,
          replacement: '$1',
        },
      ],
    },
    define: {
      // By default, Vite doesn't include shims for NodeJS.
      global: {},
    },
  })
}
