// Dependencies required by ./utils (see below) need to be explicitly required
// here to ensure that that they are included in serverless builds. Do NOT
// remove them unless they are not needed by any upstream modules.
import 'redis'
import '../src/common/utils.js'
import '../src/common/constants.js'
import '../api-etc/constants.js'
// End explicit requires for serverless builds

import { promisify } from 'util'

import axios from 'axios'

import { MARKET_SUMMARY_FOR_DISCORD } from '../api-etc/templates.js'
import { allowCors, getRedisClient, getRoomData } from '../api-etc/utils.js'

const client = getRedisClient()

const get = promisify(client.get).bind(client)
const set = promisify(client.set).bind(client)

export default allowCors(async (req, res) => {
  const { valueAdjustments } = await getRoomData('room-global', get, set)
  const content = MARKET_SUMMARY_FOR_DISCORD`${'global'}${valueAdjustments}`
  const { status } = await axios.post(
    process.env.DISCORD_GLOBAL_MARKET_VALUES_WEBHOOK,
    { content }
  )

  res.status(status).json({ content })
})
