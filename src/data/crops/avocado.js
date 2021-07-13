import { crop, fromSeed } from '../crop'
import { cropLifeStage, cropType } from '../../enums'

const { SEED, GROWING } = cropLifeStage

/**
 * @property farmhand.module:items.avocadoSeed
 * @type {farmhand.item}
 */
export const avocadoSeed = crop({
  cropType: cropType.AVOCADO,
  cropTimetable: {
    [SEED]: 6,
    [GROWING]: 8,
  },
  growsInto: 'avocado',
  id: 'avocado-seed',
  name: 'Avocado Seed',
  tier: 4,
})

/**
 * @property farmhand.module:items.avocado
 * @type {farmhand.item}
 */
export const avocado = crop({
  ...fromSeed(avocadoSeed),
  name: 'Avocado',
})
