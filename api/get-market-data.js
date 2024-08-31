// Dependencies required by ./utils (see below) need to be explicitly required
// here to ensure that that they are included in serverless builds. Do NOT
// remove them unless they are not needed by any upstream modules.
import { promisify } from 'util'

import 'redis'
import '../src/common/utils.js'
// End explicit requires for serverless builds

import {
  allowCors,
  getRedisClient,
  getRoomData,
  getRoomName,
} from '../api-etc/utils.js'

const client = getRedisClient()

const get = promisify(client.get).bind(client)
const set = promisify(client.set).bind(client)

module.exports = allowCors(async (req, res) => {
  const roomKey = getRoomName(req)

  const roomData = await getRoomData(roomKey, get, set)
  const { valueAdjustments } = roomData

  set(roomKey, JSON.stringify(roomData))

  res
    .status(200)
    // TODO: activePlayers: 1 is for legacy backwards compatibility. Remove it after 10/1/2024.
    .json({ valueAdjustments, activePlayers: 1 })
})
