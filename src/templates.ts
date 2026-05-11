import { FOREST_AVAILABLE_NOTIFICATION, SHOVEL_UNLOCKED } from './strings.js'
import { itemUnlockLevels, levels } from './data/levels.js'
import { itemsMap } from './data/maps.js'
import { moneyString } from './utils/moneyString.js'
import { stageFocusType, toolType } from './enums.js'
import {
  getCowDisplayName,
  getPlayerName,
  getRandomLevelUpRewardQuantity,
  integerString,
} from './utils/index.js'

export const CROWS_DESTROYED = (_: any, numCropsDestroyed: number): string =>
  `Oh no! Crows destroyed ${numCropsDestroyed} crop${
    numCropsDestroyed > 1 ? 's' : ''
  }!`

export const COW_PEN_PURCHASED = (_: any, cows: number): string =>
  `Purchased a cow pen with capacity for ${cows} cows! You can visit your cow pen by going to the "Cows" page.`

export const CELLAR_PURCHASED = (_: any, kegCapacity: number): string =>
  `Purchased a cellar with capacity for ${kegCapacity} kegs! View your keg inventory by going to the "Cellar" page.`

export const MILKS_PRODUCED = (
  _: any,
  milksProduced: Record<string, number>
): string => {
  let message = `Your cows produced milk:
`

  Object.keys(milksProduced)
    .sort()
    .forEach(
      milkName =>
        (message += `  - ${milksProduced[milkName]} ${milkName}${
          milksProduced[milkName] > 1 ? 's' : ''
        }
`)
    )

  return message
}

export const FERTILIZERS_PRODUCED = (
  _: any,
  fertilizersProduced: Record<string, number>
): string => {
  let message = `Your cows produced fertilizer:
`

  Object.keys(fertilizersProduced)
    .sort()
    .forEach(
      fertilizerName =>
        (message += `  - ${
          fertilizersProduced[fertilizerName]
        } ${fertilizerName}${fertilizersProduced[fertilizerName] > 1 ? 's' : ''}
`)
    )

  return message
}

export const COW_ATTRITION_MESSAGE = (_: any, cow: farmhand.cow): string =>
  `${cow.name} got hungry from being underfed and ran away!`

export const COW_BORN_MESSAGE = (
  _: any,
  parentCow1: farmhand.cow,
  parentCow2: farmhand.cow,
  offspringCow: farmhand.cow
): string =>
  `${parentCow1.name} and ${parentCow2.name} had a baby: ${offspringCow.name}! Welcome to the world, ${offspringCow.name}!`

export const RECIPE_LEARNED = (_: any, recipe: farmhand.recipe): string =>
  `You learned a new recipe: **${recipe.name}**!`

export const RECIPES_LEARNED = (
  _: any,
  learnedRecipes: farmhand.recipe[]
): string => {
  let recipesString = ''
  const learnedRecipeNames = learnedRecipes.map(({ name }) => name)

  if (learnedRecipes.length === 2) {
    recipesString = `**${learnedRecipeNames[0]}** and **${learnedRecipeNames[1]}**`
  } else if (learnedRecipes.length > 2) {
    recipesString = `**${learnedRecipeNames
      .slice(0, -1)
      .join(', ')},** and **${learnedRecipeNames.slice(-1)}**`
  }

  return `You learned the recipes for ${recipesString}!`
}

export const PRICE_CRASH = (_: any, { name }: farmhand.item): string =>
  `${name} prices have bottomed out! Avoid selling them until prices return to normal.`

export const PRICE_SURGE = (_: any, { name }: { name: string }): string =>
  `${name} prices are at their peak! Now is the time to sell!`

export const ACHIEVEMENT_COMPLETED = (
  _: any,
  { name, rewardDescription }: { name: string; rewardDescription: string }
): string =>
  `You achieved "${name}!" Way to go!

You earned: ${rewardDescription}`

export const LOAN_PAYOFF = (_?: any): string =>
  `You paid off your loan to the bank! You're finally free!`

export const LOAN_INCREASED = (_: any, loanBalance: number): string =>
  `You took out a new loan. Your current balance is ${moneyString(
    loanBalance
  )}.`

export const LOAN_BALANCE_NOTIFICATION = (
  _: any,
  loanBalance: number
): string => `Your loan balance has grown to ${moneyString(loanBalance)}.`

export const LEVEL_GAINED_NOTIFICATION = (
  _: any,
  newLevel: number,
  randomCropSeed?: farmhand.item
): string => {
  let chunks = [
    `You reached **level ${newLevel}!** Way to go!

`,
  ]

  const levelObject = levels[newLevel] as {
    increasesSprinklerRange?: boolean
    unlocksTool?: farmhand.toolType
    unlocksStageFocusType?: farmhand.stageFocusType
  }

  if (itemUnlockLevels[newLevel]) {
    chunks.push(
      `Now available in the shop: **${
        itemsMap[itemUnlockLevels[newLevel]].name
      }**.`
    )
  } else if (levelObject && levelObject.increasesSprinklerRange) {
    chunks.push(`Sprinkler range has increased.`)
  } else if (randomCropSeed) {
    chunks.push(
      `You got **${getRandomLevelUpRewardQuantity(newLevel)} units of ${
        randomCropSeed.name
      }** as a reward!`
    )
  } else if (levelObject && levelObject.unlocksTool) {
    if (levelObject.unlocksTool === toolType.SHOVEL) {
      chunks.push(SHOVEL_UNLOCKED)
    }
  } else if (levelObject && levelObject.unlocksStageFocusType) {
    if (levelObject.unlocksStageFocusType === stageFocusType.FOREST) {
      chunks.push(FOREST_AVAILABLE_NOTIFICATION)
    }
  }

  return chunks.join(' ')
}

export const CONNECTED_TO_ROOM = (_: any, room: string): string =>
  `Connected to room **${room}**!`

export const POSITIONS_POSTED_NOTIFICATION = (
  _: any,
  who: string,
  positions: Record<string, number>
): string => {
  const positivePositions: string[] = []
  const negativePositions: string[] = []
  const positionKeys = Object.keys(positions)

  positionKeys.forEach(itemId =>
    (positions[itemId as keyof typeof positions] > 0
      ? positivePositions
      : negativePositions
    ).push(itemId)
  )

  const chunks = positionKeys.length ? [`${who} impacted the market!\n`] : []

  if (positivePositions.length) {
    chunks.push('Values raised:')
    positivePositions.forEach(itemId =>
      chunks.push(`  - ${(itemsMap[itemId] as farmhand.item).name}`)
    )
  }

  if (negativePositions.length) {
    if (positivePositions.length) {
      chunks.push('') // Adds a necessary linebreak
    }

    chunks.push('Values lowered:')
    negativePositions.forEach(itemId =>
      chunks.push(`  - ${(itemsMap[itemId] as farmhand.item).name}`)
    )
  }

  return chunks.join('\n')
}

export const ROOM_FULL_NOTIFICATION = (
  _: any,
  room: string,
  nextRoom: string
): string => `Room **${room}** is full! Trying room **${nextRoom}**...`

export const PURCHASED_ITEM_PEER_NOTIFICATION = (
  _: any,
  quantity: number,
  { name }: farmhand.item
): string =>
  `purchased ${integerString(quantity)} unit${
    quantity > 1 ? 's' : ''
  } of ${name}.`

export const SOLD_ITEM_PEER_NOTIFICATION = (
  _: any,
  quantity: number,
  { name }: farmhand.item
): string =>
  `sold ${integerString(quantity)} unit${quantity > 1 ? 's' : ''} of ${name}.`

export const SOLD_FERMENTED_ITEM_PEER_NOTIFICATION = (
  _: any,
  item: farmhand.item
): string => `sold one unit of ${FERMENTED_CROP_NAME(_, item)}.`

export const TOOL_UPGRADED_NOTIFICATION = (
  _: any,
  toolName: string,
  upgradedName: string
): string => `Your ${toolName} has been upgraded to a **${upgradedName}**!`

export const INGREDIENTS_LIST_ITEM = (
  _: any,
  quantityNeeded: number,
  ingredientName: string,
  quantityAvailable: string | number
): string =>
  `${quantityNeeded} x ${ingredientName} (On hand: ${quantityAvailable})`

export const OFFER_COW_FOR_TRADE = (_: any, cowDisplayName: string): string =>
  `Offer ${cowDisplayName} for trade with online players`

export const WITHDRAW_COW_FROM_TRADE = (
  _: any,
  cowDisplayName: string
): string => `Keep ${cowDisplayName} from being traded`

export const COW_TRADED_NOTIFICATION = (
  _: any,
  cowTradedAway: farmhand.cow,
  cowReceived: farmhand.cow,
  playerId: string,
  allowCustomPeerCowNames: boolean
): string =>
  `You traded ${getCowDisplayName(
    cowTradedAway,
    playerId,
    allowCustomPeerCowNames
  )} for ${getCowDisplayName(cowReceived, playerId, allowCustomPeerCowNames)}!`

export const SHOVELED_PLOT = (_: any, item: farmhand.item): string =>
  `Shoveled plot of ${item.name}`

export const FERMENTED_CROP_NAME = (_: any, item: farmhand.item): string =>
  `Fermented ${item.name}`

export const KEG_SPOILED_MESSAGE = (_: any, keg: farmhand.keg): string =>
  `Oh no! Your ${FERMENTED_CROP_NAME(_, itemsMap[keg.itemId])} has spoiled!`

export const NEW_COW_OFFERED_FOR_TRADE = (
  _: any,
  peerMetadata: farmhand.peerMetadata
): string =>
  `A new cow is being offered for trade by ${getPlayerName(
    peerMetadata.playerId
  )}!`

export const FOREST_EXPANDED = (_: any, numTrees: number): string =>
  `The Forest has expanded! You can now plant up to ${numTrees} trees.`

export const EXPERIENCE_GAUGE_TOOLTIP_LABEL = (
  _: any,
  experiencePointsToNextLevel: number,
  nextLevel: number
): string => {
  if (experiencePointsToNextLevel === 1) {
    return `Just 1 more experience point needed to reach level ${integerString(
      nextLevel
    )}!`
  }

  return `${integerString(
    experiencePointsToNextLevel
  )} more experience points needed to reach level ${integerString(nextLevel)}`
}
