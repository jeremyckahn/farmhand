import redis from 'redis'

import { generateValueAdjustments } from '../src/common/utils'

import { GLOBAL_ROOM_KEY } from './constants'

export const getRedisClient = () =>
  redis.createClient({
    host: process.env.REDIS_ENDPOINT,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
  })

export const getRoomMarketData = async (roomKey, get, set) => {
  let valueAdjustments = JSON.parse(await get(roomKey))

  if (valueAdjustments === null) {
    valueAdjustments = generateValueAdjustments()
    set(roomKey, JSON.stringify(valueAdjustments))
  }

  return valueAdjustments
}

export const getRoomName = req => `room-${req.query.room || GLOBAL_ROOM_KEY}`
