const redis = require('redis')

const { generateValueAdjustments } = require('../src/common/utils')
const { MAX_ROOM_NAME_LENGTH } = require('../src/common/constants')

const { GLOBAL_ROOM_KEY, ACCEPTED_ORIGINS } = require('./constants')

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

module.exports.getRoomData = async (roomKey, get, set) => {
  let roomData = JSON.parse(await get(roomKey)) || {}
  let { valueAdjustments } = roomData

  if (!valueAdjustments) {
    valueAdjustments = generateValueAdjustments()
    roomData = { activePlayers: {}, valueAdjustments }
    set(roomKey, JSON.stringify(roomData))
  }

  return roomData
}

module.exports.getRoomName = req =>
  `room-${(req.query?.room || req.body?.room || GLOBAL_ROOM_KEY).slice(
    0,
    MAX_ROOM_NAME_LENGTH
  )}`

// https://vercel.com/support/articles/how-to-enable-cors
module.exports.allowCors = fn => async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true)

  // origin is not defined when the request is from the same domain as the
  // server (as it is in the local development environment).
  // https://stackoverflow.com/a/63684532
  const { origin = '' } = req.headers

  if (
    ACCEPTED_ORIGINS.has(origin) ||
    origin.match(/https:\/\/farmhand-.*-jeremyckahn.vercel.app/)
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
