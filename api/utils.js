const redis = require('redis')

const { generateValueAdjustments } = require('../src/common/utils')

const { GLOBAL_ROOM_KEY, WHITELISTED_ORIGINS } = require('./constants')

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

// https://vercel.com/support/articles/how-to-enable-cors
module.exports.allowCors = fn => async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true)

  const { origin } = req.headers

  if (WHITELISTED_ORIGINS.has(origin)) {
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
