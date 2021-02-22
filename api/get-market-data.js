import { promisify } from 'util'

import redis from 'redis'

import { generateValueAdjustments } from '../src/common/utils'

const client = redis.createClient()
const get = promisify(client.get).bind(client)
const set = promisify(client.set).bind(client)

client.on('error', function(error) {
  console.error(error)
})

module.exports = async (req, res) => {
  const roomKey = `room-${req.query.room || 'global'}`
  let valueAdjustments = JSON.parse(await get(roomKey))

  if (valueAdjustments === null) {
    valueAdjustments = generateValueAdjustments({}, {})
    set(roomKey, JSON.stringify(valueAdjustments))
  }

  res.status(200).json({ valueAdjustments: valueAdjustments })
}
