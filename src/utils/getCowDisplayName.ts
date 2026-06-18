import { getDefaultCowName } from './getDefaultCowName.js'

export const getCowDisplayName = (
  cow: farmhand.cow,
  playerId: string,
  allowCustomPeerCowNames: boolean
): string => {
  return cow.originalOwnerId !== playerId && !allowCustomPeerCowNames
    ? getDefaultCowName(cow)
    : cow.name
}
