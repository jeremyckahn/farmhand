import { fieldMode } from '../enums'

import { features } from '../config'

import {
  WATERING_CAN_ALT_TEXT,
  WATERING_CAN_HIDDEN_TEXT,
  SCYTHE_ALT_TEXT,
  SCYTHE_HIDDEN_TEXT,
  HOE_ALT_TEXT,
  HOE_HIDDEN_TEXT,
  SHOVEL_ALT_TEXT,
  SHOVEL_HIDDEN_TEXT,
} from '../strings'

const { CLEANUP, HARVEST, MINE, WATER } = fieldMode

const tools = {
  wateringCan: {
    id: 'watering-can',
    alt: WATERING_CAN_ALT_TEXT,
    fieldMode: WATER,
    order: 1,
    fieldKey: 'shift+1',
    hiddenText: WATERING_CAN_HIDDEN_TEXT,
  },
  scythe: {
    id: 'scythe',
    alt: SCYTHE_ALT_TEXT,
    fieldMode: HARVEST,
    order: 2,
    fieldKey: 'shift+2',
    hiddenText: SCYTHE_HIDDEN_TEXT,
  },
  hoe: {
    id: 'hoe',
    alt: HOE_ALT_TEXT,
    fieldMode: CLEANUP,
    order: 3,
    fieldKey: 'shift+3',
    hiddenText: HOE_HIDDEN_TEXT,
  },
}

if (features.MINING) {
  tools.shovel = {
    id: 'shovel',
    alt: SHOVEL_ALT_TEXT,
    fieldMode: MINE,
    order: 4,
    fieldKey: 'shift+4',
    hiddenText: SHOVEL_HIDDEN_TEXT,
  }
}

export default tools
