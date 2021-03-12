// Dependencies required by ./utils (see below) need to be explicitly required
// here to ensure that that they are included in serverless builds. Do NOT
// remove them unless they are not needed by any upstream modules.
require('redis')
require('../src/common/utils')
require('../api-etc/constants')
// End explicit requires for serverless builds

const { promisify } = require('util')

const {
  allowCors,
  getRedisClient,
  getRoomMarketData,
  getRoomName,
} = require('../api-etc/utils')

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

      const variance = Math.random() * 0.2

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
          acc[itemName] = Math.random() + MIN
        }
      }

      return acc
    },
    {
      ...valueAdjustments,
    }
  )
}

module.exports = allowCors(async (req, res) => {
  const {
    body: { positions = {} },
  } = req

  const roomKey = getRoomName(req)
  const valueAdjustments = await getRoomMarketData(roomKey, get, set)
  const updatedValueAdjustments = applyPositionsToMarket(
    valueAdjustments,
    positions
  )

  set(roomKey, JSON.stringify(updatedValueAdjustments))

  res.status(200).json({ valueAdjustments: updatedValueAdjustments })
})
