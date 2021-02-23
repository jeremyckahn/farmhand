import redis from 'redis'

import { generateValueAdjustments } from '../src/common/utils'

import { GLOBAL_ROOM_KEY } from './constants'

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

  client.on('error', function(error) {
    console.log('[REDIS] error')
    console.error(error)
  })

  return client
}

export const getRoomMarketData = async (roomKey, get, set) => {
  let valueAdjustments = JSON.parse(await get(roomKey))

  if (valueAdjustments === null) {
    valueAdjustments = generateValueAdjustments()
    set(roomKey, JSON.stringify(valueAdjustments))
  }

  return valueAdjustments
}

export const getRoomName = req =>
  `room-${req.query?.room || req.body?.room || GLOBAL_ROOM_KEY}`
