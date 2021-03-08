// Dependencies required by ./utils (see below) need to be explicitly required
// here to ensure that that they are included in serverless builds. Do NOT
// remove them unless they are not needed by any upstream modules.
require('redis')
require('../src/common/utils')
require('./constants')
// End explicit requires for serverless builds

const { promisify } = require('util')

const axios = require('axios')

const { MARKET_SUMMARY_FOR_DISCORD } = require('./templates')
const { allowCors, getRedisClient, getRoomMarketData } = require('./utils')

const client = getRedisClient()

const get = promisify(client.get).bind(client)
const set = promisify(client.set).bind(client)

module.exports = allowCors(async (req, res) => {
  const room = 'global'
  const valueAdjustments = await getRoomMarketData(room, get, set)
  const content = MARKET_SUMMARY_FOR_DISCORD`${room}${valueAdjustments}`
  const { status } = await axios.post(
    process.env.DISCORD_GLOBAL_MARKET_VALUES_WEBHOOK,
    { content }
  )

  res.status(status).json({ content })
})
