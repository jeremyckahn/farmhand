import { fieldMode } from '../enums'

import { features } from '../config'

const { CLEANUP, HARVEST, MINE, WATER } = fieldMode

const tools = {
  'watering-can': {
    alt: 'A watering can for hydrating plants.',
    fieldMode: WATER,
  },
  scythe: {
    alt: 'A scythe for crop harvesting.',
    fieldMode: HARVEST,
  },
  hoe: {
    alt:
      'A hoe for removing crops and disposing of them. Also returns replantable items to your inventory.',
    fieldMode: CLEANUP,
  },
}

if (features.MINING) {
  tools.shovel = {
    alt: 'A shovel for digging up rocks.',
    fieldMode: MINE,
  }
}

export default tools
