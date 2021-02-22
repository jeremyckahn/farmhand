import { promisify } from 'util'

import redis from 'redis'

import { getRoomMarketData, getRoomName } from './utils'

const client = redis.createClient()
const get = promisify(client.get).bind(client)
const set = promisify(client.set).bind(client)

client.on('error', function(error) {
  console.error(error)
})

module.exports = async (req, res) => {
  const valueAdjustments = await getRoomMarketData(getRoomName(req), get, set)

  res.status(200).json({ valueAdjustments })
}
