/**
 * @type {Partial<import('vite-plugin-pwa').ManifestOptions>}
 */
export const manifest = {
  short_name: 'Farmhand',
  name: 'Farmhand',
  icons: [
    {
      src: 'favicon.ico',
      sizes: '64x64 32x32 24x24 16x16',
      type: 'image/x-icon',
    },
    {
      src: 'logo192.png',
      type: 'image/png',
      sizes: '192x192',
    },
    {
      src: 'logo512.png',
      type: 'image/png',
      sizes: '512x512',
    },
    {
      src: 'logoMaskable.png',
      type: 'image/png',
      purpose: 'maskable',
      sizes: '731x731',
    },
  ],
  start_url: './index.html',
  display: 'standalone',
  theme_color: '#ffe3a1',
  background_color: '#ffffff',
}
