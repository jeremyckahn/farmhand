import { animals } from '../img/index.js'
import { cowColors } from '../enums.js'

import { convertStringToInteger } from './convertStringToInteger.js'
import { colorizeCowTemplate } from './colorizeCowTemplate.js'

export const getCowImage = async (cow: farmhand.cow): Promise<string> => {
  const cowIdNumber = convertStringToInteger(cow.id)
  const { variations } = animals.cow
  const cowTemplate = variations[cowIdNumber % variations.length]

  return await colorizeCowTemplate(cowTemplate, cow.color as farmhand.cowColors)
}
