import { promisify } from 'util'

import redis from 'redis'

import { generateValueAdjustments } from '../src/common/utils'

const client = redis.createClient()
const get = promisify(client.get).bind(client)
const set = promisify(client.set).bind(client)

client.on('error', function(error) {
  console.error(error)
})

const getRoomMarketData = async roomKey => {
  let valueAdjustments = JSON.parse(await get(roomKey))

  if (valueAdjustments === null) {
    valueAdjustments = generateValueAdjustments()
    set(roomKey, JSON.stringify(valueAdjustments))
  }

  return valueAdjustments
}

module.exports = async (req, res) => {
  const valueAdjustments = await getRoomMarketData(
    `room-${req.query.room || 'global'}`
  )

  res.status(200).json({ valueAdjustments })
}
