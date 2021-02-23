const redis = require('redis')

const { generateValueAdjustments } = require('../src/common/utils')

const { GLOBAL_ROOM_KEY } = require('./constants')

module.exports.getRedisClient = () => {
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

module.exports.getRoomMarketData = async (roomKey, get, set) => {
  let valueAdjustments = JSON.parse(await get(roomKey))

  if (valueAdjustments === null) {
    valueAdjustments = generateValueAdjustments()
    set(roomKey, JSON.stringify(valueAdjustments))
  }

  return valueAdjustments
}

module.exports.getRoomName = req =>
  `room-${req.query?.room || req.body?.room || GLOBAL_ROOM_KEY}`
