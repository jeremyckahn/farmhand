import { fieldMode } from '../enums'

import { features } from '../config'

const { CLEANUP, HARVEST, MINE, WATER } = fieldMode

const tools = {
  wateringCan: {
    id: 'watering-can',
    alt: 'A watering can for hydrating plants.',
    fieldMode: WATER,
    order: 1,
    fieldKey: 'shift+1',
  },
  scythe: {
    id: 'scythe',
    alt: 'A scythe for crop harvesting.',
    fieldMode: HARVEST,
    order: 2,
    fieldKey: 'shift+2',
  },
  hoe: {
    id: 'hoe',
    alt:
      'A hoe for removing crops and disposing of them. Also returns replantable items to your inventory.',
    fieldMode: CLEANUP,
    order: 3,
    fieldKey: 'shift+3',
  },
}

if (features.MINING) {
  tools.shovel = {
    id: 'shovel',
    alt: 'A shovel for digging up rocks.',
    fieldMode: MINE,
    order: 4,
    fieldKey: 'shift+4',
  }
}

export default tools
