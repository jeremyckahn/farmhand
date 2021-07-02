import { fieldMode } from '../enums'

const { CLEANUP, HARVEST, MINE, WATER } = fieldMode

export default {
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
  shovel: {
    alt: 'A shovel for digging for rocks.',
    fieldMode: MINE,
  },
}
