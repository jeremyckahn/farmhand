require('redis')
require('../src/common/utils')
const { promisify } = require('util')

const { getRedisClient, getRoomMarketData, getRoomName } = require('./utils')

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

      if (itemPositionChange > 0) {
        acc[itemName] = Math.min(1.5, acc[itemName] + variance)
      } else if (itemPositionChange < 0) {
        acc[itemName] = Math.max(0.5, acc[itemName] - variance)
      }

      return acc
    },
    {
      ...valueAdjustments,
    }
  )
}

module.exports = async (req, res) => {
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
}
