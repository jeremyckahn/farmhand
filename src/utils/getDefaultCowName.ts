import fruitNames from '../data/fruit-names.js'

import { convertStringToInteger } from './convertStringToInteger.js'

export const getDefaultCowName = ({ id }: { id: string }): string =>
  fruitNames[convertStringToInteger(id) % fruitNames.length]
