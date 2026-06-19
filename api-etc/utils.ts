import redis from 'redis'

import { generateValueAdjustments } from '../src/common/utils.ts'
import { MAX_ROOM_NAME_LENGTH } from '../src/common/constants.ts'

import { GLOBAL_ROOM_KEY, ACCEPTED_ORIGINS } from './constants.ts'

export const getRedisClient = () => {
  const client = redis.createClient({
    host: process.env.REDIS_ENDPOINT,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
  })
  ;['connect', 'ready', 'reconnecting'].forEach(event =>
    client.on(event, () => {
      console.log(`[REDIS] ${event}`)
    })
  )

  client.on('error', function(error: Error) {
    console.log('[REDIS] error')
    console.error(error)
  })

  return client
}

export const getRoomData = async (
  roomKey: string,
  get: (key: string) => Promise<string | null> | string | null,
  set: (key: string, value: string) => any
) => {
  let roomData = JSON.parse((await get(roomKey)) || '{}') || {}
  let { valueAdjustments } = roomData

  if (!valueAdjustments) {
    valueAdjustments = generateValueAdjustments()
    roomData = { valueAdjustments }
    set(roomKey, JSON.stringify(roomData))
  }

  return roomData
}

export const getRoomName = (req: {
  query?: Record<string, string | string[]>
  body?: Record<string, any>
}) =>
  `room-${(req.query?.room || req.body?.room || GLOBAL_ROOM_KEY).slice(
    0,
    MAX_ROOM_NAME_LENGTH
  )}`

// https://vercel.com/support/articles/how-to-enable-cors
export const allowCors = (
  fn: (req: any, res: any) => Promise<any> | any
) => async (
  req: {
    headers: Record<string, string | string[] | undefined>
    method?: string
    query?: Record<string, string | string[]>
    body?: Record<string, any>
  },
  res: {
    setHeader(key: string, value: string | boolean): void
    status(code: number): { end(): void }
  }
) => {
  res.setHeader('Access-Control-Allow-Credentials', true)

  // origin is not defined when the request is from the same domain as the
  // server (as it is in the local development environment).
  const originHeader = req.headers.origin
  const origin = Array.isArray(originHeader)
    ? originHeader[0]
    : originHeader || ''

  if (
    ACCEPTED_ORIGINS.has(origin) ||
    origin.match(/https:\/\/farmhand-.*-jeremy-kahns-projects.*.vercel.app/)
  ) {
    res.setHeader('Access-Control-Allow-Origin', origin)
  }

  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET,OPTIONS,PATCH,DELETE,POST,PUT'
  )

  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  return await fn(req, res)
}
