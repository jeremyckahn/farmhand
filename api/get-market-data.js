// Dependencies required by ./utils (see below) need to be explicitly required
// here to ensure that that they are included in serverless builds. Do NOT
// remove them unless they are not needed by any upstream modules.
const { promisify } = require('util')

require('redis')
require('../src/common/utils')
const { SERVER_ERRORS } = require('../src/common/constants')
const { MAX_ROOM_SIZE } = require('../api-etc/constants')
// End explicit requires for serverless builds

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

  const activePlayerIds = Object.keys(activePlayers)

  if (activePlayerIds.length >= MAX_ROOM_SIZE) {
    return res.status(403).json({ errorCode: SERVER_ERRORS.ROOM_FULL })
  }

  // Clean up stale activePlayers data
  activePlayerIds.forEach(activePlayerId => {
    const timestamp = activePlayers[activePlayerId]
    const delta = now - timestamp

    // Multiply HEARTBEAT_INTERVAL_PERIOD by some amount to account for network
    // latency and other transient heartbeat delays
    const evictionTimeout = HEARTBEAT_INTERVAL_PERIOD * 2.5

    if (delta > evictionTimeout) {
      delete activePlayers[activePlayerId]
    } else {
      numberOfActivePlayers++
    }
  })

  set(roomKey, JSON.stringify({ ...roomData, activePlayers }))

  res
    .status(200)
    .json({ activePlayers: numberOfActivePlayers, valueAdjustments })
})
