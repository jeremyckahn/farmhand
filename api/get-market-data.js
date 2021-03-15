// Dependencies required by ./utils (see below) need to be explicitly required
// here to ensure that that they are included in serverless builds. Do NOT
// remove them unless they are not needed by any upstream modules.
require('redis')
require('../src/common/utils')
require('../src/common/constants')
require('../api-etc/constants')
// End explicit requires for serverless builds

const { promisify } = require('util')

const {
  allowCors,
  getRedisClient,
  getRoomData,
  getRoomName,
} = require('../api-etc/utils')
const { HEARTBEAT_INTERVAL_PERIOD } = require('../src/common/constants')

const client = getRedisClient()

const get = promisify(client.get).bind(client)
const set = promisify(client.set).bind(client)

module.exports = allowCors(async (req, res) => {
  const { farmId = null } = req.query
  const roomKey = getRoomName(req)

  const roomData = await getRoomData(roomKey, get, set)
  const { activePlayers, valueAdjustments } = roomData

  const now = Date.now()

  if (farmId) {
    activePlayers[farmId] = now
  }

  let numberOfActivePlayers = 0

  // Clean up stale activePlayers data
  Object.keys(activePlayers).forEach(activeFarmId => {
    const timestamp = activePlayers[activeFarmId]
    const delta = now - timestamp

    // Multiply HEARTBEAT_INTERVAL_PERIOD by some small amount to account for
    // network latency and other transient heartbeat delays
    const evictionTimeout = HEARTBEAT_INTERVAL_PERIOD * 1.5

    if (delta > evictionTimeout) {
      delete activePlayers[activeFarmId]
    } else {
      numberOfActivePlayers++
    }
  })

  set(roomKey, JSON.stringify({ ...roomData, activePlayers }))

  res
    .status(200)
    .json({ activePlayers: numberOfActivePlayers, valueAdjustments })
})
