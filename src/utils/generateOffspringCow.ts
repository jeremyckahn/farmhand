import { genders, cowColors, standardCowColors } from '../enums.js'

import { chooseRandom } from './chooseRandom.js'
import { generateCow } from './generateCow.js'

export const generateOffspringCow = (
  cow1: farmhand.cow,
  cow2: farmhand.cow,
  ownerId: string,
  customProps = {}
): farmhand.cow => {
  if (cow1.gender === cow2.gender) {
    throw new Error(
      `${JSON.stringify(cow1)} ${JSON.stringify(
        cow2
      )} cannot produce offspring because they have the same gender`
    )
  }

  const maleCow = cow1.gender === genders.MALE ? cow1 : cow2
  const femaleCow = cow1.gender === genders.MALE ? cow2 : cow1
  // TODO: Clean up the following legacy color mapping code which is no longer
  // needed (scheduled for removal on 11/1/2020).
  const colorsInBloodline: Partial<Record<cowColors, boolean>> = {
    // These lines are for backwards compatibility and can be removed on 11/1/2020
    [maleCow.color]: true,
    [femaleCow.color]: true,
    // End backwards compatibility lines to remove
    ...maleCow.colorsInBloodline,
    ...femaleCow.colorsInBloodline,
  }

  delete colorsInBloodline[cowColors.RAINBOW]

  const isRainbowCow =
    Object.keys(colorsInBloodline).length ===
    Object.keys(standardCowColors).length

  return generateCow({
    color: isRainbowCow
      ? cowColors.RAINBOW
      : chooseRandom([femaleCow.color, maleCow.color]),
    colorsInBloodline,
    baseWeight: (maleCow.baseWeight + femaleCow.baseWeight) / 2,
    isBred: true,
    ownerId,
    originalOwnerId: ownerId,
    ...customProps,
  })
}
