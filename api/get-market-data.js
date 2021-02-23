require('redis')
require('../src/common/utils')
const { promisify } = require('util')

const { getRedisClient, getRoomMarketData, getRoomName } = require('./utils')

const client = getRedisClient()

const get = promisify(client.get).bind(client)
const set = promisify(client.set).bind(client)

module.exports = async (req, res) => {
  const valueAdjustments = await getRoomMarketData(getRoomName(req), get, set)

  res.status(200).json({ valueAdjustments })
}
