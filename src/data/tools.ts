import { fieldMode, stageFocusType, toolType } from '../enums.js'

import {
  AXE_ALT_TEXT,
  AXE_HIDDEN_TEXT,
  HOE_ALT_TEXT,
  HOE_HIDDEN_TEXT,
  PICKER_POLE_ALT_TEXT,
  PICKER_POLE_HIDDEN_TEXT,
  SCYTHE_ALT_TEXT,
  SCYTHE_HIDDEN_TEXT,
  SHOVEL_ALT_TEXT,
  SHOVEL_HIDDEN_TEXT,
  TOOL_LEVEL_INFO,
  WATERING_CAN_ALT_TEXT,
  WATERING_CAN_HIDDEN_TEXT,
} from '../strings.js'

const { CHOP, CLEANUP, HARVEST, HARVEST_FRUIT, MINE, WATER } = fieldMode
const { FIELD, FOREST } = stageFocusType

const tools = {
  wateringCan: {
    alt: WATERING_CAN_ALT_TEXT,
    fieldKey: 'shift+1',
    fieldMode: WATER,
    hiddenText: WATERING_CAN_HIDDEN_TEXT,
    id: 'watering-can',
    levelInfo: TOOL_LEVEL_INFO.WATERING_CAN,
    order: 1,
    screens: [FIELD],
    type: toolType.WATERING_CAN,
  },
  scythe: {
    alt: SCYTHE_ALT_TEXT,
    fieldKey: 'shift+2',
    fieldMode: HARVEST,
    hiddenText: SCYTHE_HIDDEN_TEXT,
    id: 'scythe',
    levelInfo: TOOL_LEVEL_INFO.SCYTHE,
    order: 2,
    screens: [FIELD],
    type: toolType.SCYTHE,
  },
  hoe: {
    alt: HOE_ALT_TEXT,
    fieldKey: 'shift+3',
    fieldMode: CLEANUP,
    hiddenText: HOE_HIDDEN_TEXT,
    id: 'hoe',
    levelInfo: TOOL_LEVEL_INFO.HOE,
    order: 3,
    screens: [FIELD],
    type: toolType.HOE,
  },
  shovel: {
    alt: SHOVEL_ALT_TEXT,
    fieldKey: 'shift+4',
    fieldMode: MINE,
    hiddenText: SHOVEL_HIDDEN_TEXT,
    id: 'shovel',
    levelInfo: TOOL_LEVEL_INFO.SHOVEL,
    order: 4,
    screens: [FIELD],
    type: toolType.SHOVEL,
  },
  axe: {
    alt: AXE_ALT_TEXT,
    fieldKey: 'shift+5',
    fieldMode: CHOP,
    hiddenText: AXE_HIDDEN_TEXT,
    id: 'axe',
    levelInfo: TOOL_LEVEL_INFO.AXE,
    order: 5,
    screens: [FOREST],
    type: toolType.AXE,
  },
  pickerPole: {
    alt: PICKER_POLE_ALT_TEXT,
    fieldKey: 'shift+6',
    fieldMode: HARVEST_FRUIT,
    hiddenText: PICKER_POLE_HIDDEN_TEXT,
    id: 'picker-pole',
    levelInfo: TOOL_LEVEL_INFO.PICKER_POLE,
    order: 6,
    screens: [FOREST],
    type: toolType.PICKER_POLE,
  },
}

export default tools
