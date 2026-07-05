export const GLOBAL_ROOM_KEY = 'global'

export const ACCEPTED_ORIGINS = new Set([
  'http://localhost:3000',
  'http://farmhand:3000', // E2E environment
  'http://localhost:3002', // E2E dedicated port
  'http://farmhand:3002', // E2E dedicated port (Docker)
  'https://farmhand.vercel.app',
  'https://jeremyckahn.github.io',
  'https://www.farmhand.life',
  'https://v6p9d9t4.ssl.hwcdn.net', // itch.io's CDN that the game is served from
])
