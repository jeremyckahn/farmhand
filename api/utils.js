import { generateValueAdjustments } from '../src/common/utils'

import { GLOBAL_ROOM_KEY } from './constants'

export const getRoomMarketData = async (roomKey, get, set) => {
  let valueAdjustments = JSON.parse(await get(roomKey))

  if (valueAdjustments === null) {
    valueAdjustments = generateValueAdjustments()
    set(roomKey, JSON.stringify(valueAdjustments))
  }

  return valueAdjustments
}

export const getRoomName = req => `room-${req.query.room || GLOBAL_ROOM_KEY}`
