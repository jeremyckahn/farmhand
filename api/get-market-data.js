// Dependencies required by ./utils (see below) need to be explicitly required
// here to ensure that that they are included in serverless builds. Do NOT
// remove them unless they are not needed by any upstream modules.
require('redis')
require('../src/common/utils')
require('../src/common/constants')
require('../api-etc/constants')
// End explicit requires for serverless builds

const { promisify } = require('util')

const {
  allowCors,
  getRedisClient,
  getRoomData,
  getRoomName,
} = require('../api-etc/utils')

const client = getRedisClient()

const get = promisify(client.get).bind(client)
const set = promisify(client.set).bind(client)

module.exports = allowCors(async (req, res) => {
  const { valueAdjustments } = await getRoomData(getRoomName(req), get, set)

  res.status(200).json({ valueAdjustments })
})
