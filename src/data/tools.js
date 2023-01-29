import { fieldMode, toolType } from '../enums'

import {
  HOE_ALT_TEXT,
  HOE_HIDDEN_TEXT,
  SCYTHE_ALT_TEXT,
  SCYTHE_HIDDEN_TEXT,
  SHOVEL_ALT_TEXT,
  SHOVEL_HIDDEN_TEXT,
  TOOL_LEVEL_INFO,
  WATERING_CAN_ALT_TEXT,
  WATERING_CAN_HIDDEN_TEXT,
} from '../strings'

const { CLEANUP, HARVEST, MINE, WATER } = fieldMode

const tools = {
  wateringCan: {
    alt: WATERING_CAN_ALT_TEXT,
    fieldKey: 'shift+1',
    fieldMode: WATER,
    hiddenText: WATERING_CAN_HIDDEN_TEXT,
    playerId: 'watering-can',
    levelInfo: TOOL_LEVEL_INFO.WATERING_CAN,
    order: 1,
    type: toolType.WATERING_CAN,
  },
  scythe: {
    alt: SCYTHE_ALT_TEXT,
    fieldKey: 'shift+2',
    fieldMode: HARVEST,
    hiddenText: SCYTHE_HIDDEN_TEXT,
    playerId: 'scythe',
    levelInfo: TOOL_LEVEL_INFO.SCYTHE,
    order: 2,
    type: toolType.SCYTHE,
  },
  hoe: {
    alt: HOE_ALT_TEXT,
    fieldKey: 'shift+3',
    fieldMode: CLEANUP,
    hiddenText: HOE_HIDDEN_TEXT,
    playerId: 'hoe',
    levelInfo: TOOL_LEVEL_INFO.HOE,
    order: 3,
    type: toolType.HOE,
  },
  shovel: {
    alt: SHOVEL_ALT_TEXT,
    fieldKey: 'shift+4',
    fieldMode: MINE,
    hiddenText: SHOVEL_HIDDEN_TEXT,
    playerId: 'shovel',
    levelInfo: TOOL_LEVEL_INFO.SHOVEL,
    order: 4,
    type: toolType.SHOVEL,
  },
}

export default tools
