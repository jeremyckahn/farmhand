/**
 */

/**
 * @module farmhand.templates
 * @ignore
 */

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

/**
 * @param _
 * @param numCropsDestroyed
 * @returns {string}
 */
export const CROWS_DESTROYED = (_, numCropsDestroyed) =>
  `Oh no! Crows destroyed ${numCropsDestroyed} crop${
    numCropsDestroyed > 1 ? 's' : ''
  }!`

/**
 * @param _
 * @param cows
 * @returns {string}
 */
export const COW_PEN_PURCHASED = (_, cows) =>
  `Purchased a cow pen with capacity for ${cows} cows! You can visit your cow pen by going to the "Cows" page.`

/**
 * @param _
 * @param kegCapacity
 * @returns {string}
 */
export const CELLAR_PURCHASED = (_, kegCapacity) =>
  `Purchased a cellar with capacity for ${kegCapacity} kegs! View your keg inventory by going to the "Cellar" page.`

/**
 * @param _
 * @param milksProduced
 * @returns {string}
 */
export const MILKS_PRODUCED = (_, milksProduced) => {
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

/**
 * @param _
 * @param fertilizersProduced
 * @returns {string}
 */
export const FERTILIZERS_PRODUCED = (_, fertilizersProduced) => {
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

/**
 * @param _
 * @param cow
 * @returns {string}
 */
export const COW_ATTRITION_MESSAGE = (_, cow) =>
  `${cow.name} got hungry from being underfed and ran away!`

/**
 * @param _
 * @param parentCow1
 * @param parentCow2
 * @param offspringCow
 * @returns {string}
 */
export const COW_BORN_MESSAGE = (_, parentCow1, parentCow2, offspringCow) =>
  `${parentCow1.name} and ${parentCow2.name} had a baby: ${offspringCow.name}! Welcome to the world, ${offspringCow.name}!`

/**
 * @param _
 * @param recipe
 * @returns {string}
 */
export const RECIPE_LEARNED = (_, recipe) =>
  `You learned a new recipe: **${recipe.name}**!`

export const RECIPES_LEARNED = (_, learnedRecipes) => {
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

/**
 * @param _
 * @param item
 * @returns {string}
 */
export const PRICE_CRASH = (_, { name }) =>
  `${name} prices have bottomed out! Avoid selling them until prices return to normal.`

/**
 * @param _
 * @param {{ name: string }} item
 * @returns {string}
 */
export const PRICE_SURGE = (_, { name }) =>
  `${name} prices are at their peak! Now is the time to sell!`

/**
 * @param _
 * @param {{ name: string, rewardDescription: string }} achievement
 * @returns {string}
 */
export const ACHIEVEMENT_COMPLETED = (_, { name, rewardDescription }) =>
  `You achieved "${name}!" Way to go!

You earned: ${rewardDescription}`

/**
 * @returns {string}
 */
export const LOAN_PAYOFF = () =>
  `You paid off your loan to the bank! You're finally free!`

/**
 * @param _
 * @param loanBalance
 * @returns {string}
 */
export const LOAN_INCREASED = (_, loanBalance) =>
  `You took out a new loan. Your current balance is ${moneyString(
    loanBalance
  )}.`

/**
 * @param _
 * @param loanBalance
 * @returns {string}
 */
export const LOAN_BALANCE_NOTIFICATION = (_, loanBalance) =>
  `Your loan balance has grown to ${moneyString(loanBalance)}.`

/**
 * @param _
 * @param newLevel
 * @param [randomCropSeed]
 * @returns {string}
 */
export const LEVEL_GAINED_NOTIFICATION = (_, newLevel, randomCropSeed) => {
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

/**
 * @param _
 * @param room
 * @returns {string}
 */
export const CONNECTED_TO_ROOM = (_, room) => `Connected to room **${room}**!`

/**
 * @param _
 * @param who
 * @param positions
 * @returns {string}
 */
export const POSITIONS_POSTED_NOTIFICATION = (_, who, positions) => {
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

/**
 * @param _
 * @param room
 * @param nextRoom
 * @returns {string}
 */
export const ROOM_FULL_NOTIFICATION = (_, room, nextRoom) =>
  `Room **${room}** is full! Trying room **${nextRoom}**...`

/**
 * @param _
 * @param quantity
 * @param item
 * @returns {string}
 */
export const PURCHASED_ITEM_PEER_NOTIFICATION = (_, quantity, { name }) =>
  `purchased ${integerString(quantity)} unit${
    quantity > 1 ? 's' : ''
  } of ${name}.`

/**
 * @param _
 * @param quantity
 * @param item
 * @returns {string}
 */
export const SOLD_ITEM_PEER_NOTIFICATION = (_, quantity, { name }) =>
  `sold ${integerString(quantity)} unit${quantity > 1 ? 's' : ''} of ${name}.`

/**
 * @param _
 * @param item
 * @returns {string}
 */
export const SOLD_FERMENTED_ITEM_PEER_NOTIFICATION = (_, item) =>
  `sold one unit of ${FERMENTED_CROP_NAME(_, item)}.`

/**
 * @param _
 * @param toolName - the name of the tool being replaced
 * @param upgradedName - the new name of the tool
 */
export const TOOL_UPGRADED_NOTIFICATION = (_, toolName, upgradedName) =>
  `Your ${toolName} has been upgraded to a **${upgradedName}**!`

export const INGREDIENTS_LIST_ITEM = (
  _,
  ingredientName,
  quantityNeeded,
  quantityAvailable
) => `${ingredientName} x ${quantityNeeded} (On hand: ${quantityAvailable})`

/**
 * @param _
 * @param cowDisplayName
 * @returns {string}
 */
export const OFFER_COW_FOR_TRADE = (_, cowDisplayName) =>
  `Offer ${cowDisplayName} for trade with online players`

/**
 * @param _
 * @param cowDisplayName
 * @returns {string}
 */
export const WITHDRAW_COW_FROM_TRADE = (_, cowDisplayName) =>
  `Keep ${cowDisplayName} from being traded`

/**
 * @param _
 * @param cowTradedAway
 * @param cowReceived
 * @param playerId
 * @param allowCustomPeerCowNames
 * @returns {string}
 */
export const COW_TRADED_NOTIFICATION = (
  _,
  cowTradedAway,
  cowReceived,
  playerId,
  allowCustomPeerCowNames
) =>
  `You traded ${getCowDisplayName(
    cowTradedAway,
    playerId,
    allowCustomPeerCowNames
  )} for ${getCowDisplayName(cowReceived, playerId, allowCustomPeerCowNames)}!`

/**
 * @param _
 * @param item
 * @returns {string}
 */
export const SHOVELED_PLOT = (_, item) => `Shoveled plot of ${item.name}`

/**
 * @param _
 * @param item
 * @returns {string}
 */
export const FERMENTED_CROP_NAME = (_, item) => `Fermented ${item.name}`

/**
 * @param _
 * @param keg
 * @returns {string}
 */
export const KEG_SPOILED_MESSAGE = (_, keg) =>
  `Oh no! Your ${FERMENTED_CROP_NAME(_, itemsMap[keg.itemId])} has spoiled!`

/**
 * @param _
 * @param peerMetadata
 * @returns {string}
 */
export const NEW_COW_OFFERED_FOR_TRADE = (_, peerMetadata) =>
  `A new cow is being offered for trade by ${getPlayerName(
    peerMetadata.playerId
  )}!`

/**
 * @param _
 * @param numTrees
 * @returns {string}
 */
export const FOREST_EXPANDED = (_, numTrees) =>
  `The Forest has expanded! You can now plant up to ${numTrees} trees.`

/**
 * @param _
 * @param experiencePointsToNextLevel
 * @param nextLevel
 * @returns {string}
 */
export const EXPERIENCE_GAUGE_TOOLTIP_LABEL = (
  _,
  experiencePointsToNextLevel,
  nextLevel
) => {
  if (experiencePointsToNextLevel === 1) {
    return `Just 1 more experience point needed to reach level ${integerString(
      nextLevel
    )}!`
  }

  return `${integerString(
    experiencePointsToNextLevel
  )} more experience points needed to reach level ${integerString(nextLevel)}`
}
