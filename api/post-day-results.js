// Dependencies required by ./utils (see below) need to be explicitly required
// here to ensure that that they are included in serverless builds. Do NOT
// remove them unless they are not needed by any upstream modules.
import 'redis'
import '../src/common/utils.js'
import '../src/common/constants.js'
import '../api-etc/constants.js'
// End explicit requires for serverless builds

import { promisify } from 'util'

import {
  allowCors,
  getRedisClient,
  getRoomData,
  getRoomName,
} from '../api-etc/utils.js'
import { random } from '../src/common/utils.js'

const client = getRedisClient()

const get = promisify(client.get).bind(client)
const set = promisify(client.set).bind(client)

client.on('error', function(error) {
  console.error(error)
})

const applyPositionsToMarket = (valueAdjustments, positions) => {
  return Object.keys(valueAdjustments).reduce(
    (acc, itemName) => {
      const itemPositionChange = positions[itemName]

      const variance = random() * 0.2

      const MAX = 1.5
      const MIN = 0.5

      if (itemPositionChange > 0) {
        acc[itemName] = Math.min(MAX, acc[itemName] + variance)
      } else if (itemPositionChange < 0) {
        acc[itemName] = Math.max(MIN, acc[itemName] - variance)
      } /* itemPositionChange == 0 */ else {
        // If item value is at a range boundary but was not changed in this
        // operation, randomize it to introduce some variability to the market.
        if (acc[itemName] === MAX || acc[itemName] === MIN) {
          acc[itemName] = random() + MIN
        }
      }

      return acc
    },
    {
      ...valueAdjustments,
    }
  )
}

export default allowCors(async (req, res) => {
  const {
    body: { positions = {} },
  } = req

  const roomKey = getRoomName(req)
  const { valueAdjustments, ...roomData } = await getRoomData(roomKey, get, set)
  const updatedValueAdjustments = applyPositionsToMarket(
    valueAdjustments,
    positions
  )

  set(
    roomKey,
    JSON.stringify({ ...roomData, valueAdjustments: updatedValueAdjustments })
  )

  res.status(200).json({ valueAdjustments: updatedValueAdjustments })
})
