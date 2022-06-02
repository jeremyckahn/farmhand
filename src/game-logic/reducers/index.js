/**
 * @module farmhand.reducers
 * @ignore
 */

import { itemsMap } from '../../data/maps'
import achievements from '../../data/achievements'
import {
  areHuggingMachinesInInventory,
  getCostOfNextStorageExpansion,
  getPlotContentType,
  moneyTotal,
  nullArray,
} from '../../utils'
import {
  COW_GESTATION_PERIOD_DAYS,
  COW_HUG_BENEFIT,
  HUGGING_MACHINE_ITEM_ID,
  MAX_ANIMAL_NAME_LENGTH,
  MAX_DAILY_COW_HUG_BENEFITS,
  MAX_LATEST_PEER_MESSAGES,
  MAX_PENDING_PEER_MESSAGES,
  PURCHASEABLE_COMBINES,
  PURCHASEABLE_COW_PENS,
  PURCHASEABLE_FIELD_SIZES,
  PURCHASEABLE_SMELTERS,
  STORAGE_EXPANSION_AMOUNT,
} from '../../constants'
import { FORGE_AVAILABLE_NOTIFICATION } from '../../strings'
import {
  ACHIEVEMENT_COMPLETED,
  LOAN_INCREASED,
  LOAN_PAYOFF,
} from '../../templates'
import { itemType } from '../../enums'

import { addItemToInventory } from './addItemToInventory'
import { decrementItemFromInventory } from './decrementItemFromInventory'
import { showNotification } from './showNotification'
import { modifyFieldPlotAt } from './modifyFieldPlotAt'
import { updateLearnedRecipes } from './updateLearnedRecipes'

export * from './addItemToInventory'
export * from './applyCrows'
export * from './applyPrecipitation'
export * from './clearPlot'
export * from './decrementItemFromInventory'
export * from './fertilizePlot'
export * from './harvestPlot'
export * from './incrementPlotContentAge'
export * from './minePlot'
export * from './modifyFieldPlotAt'
export * from './plantInPlot'
export * from './processField'
export * from './processSprinklers'
export * from './processWeather'
export * from './removeFieldPlotAt'
export * from './resetWasShoveled'
export * from './setScarecrow'
export * from './setSprinkler'
export * from './showNotification'
export * from './waterAllPlots'
export * from './waterField'
export * from './processNerfs'
export * from './createPriceEvent'
export * from './processLevelUp'
export * from './processFeedingCows'
export * from './processCowAttrition'
export * from './processMilkingCows'
export * from './processCowFertilizerProduction'
export * from './processCowBreeding'
export * from './computeCowInventoryForNextDay'
export * from './rotateNotificationLogs'
export * from './generatePriceEvents'
export * from './updatePriceEvents'
export * from './updateFinancialRecords'
export * from './updateInventoryRecordsForNextDay'
export * from './computeStateForNextDay'
export * from './purchaseItem'
export * from './addRevenue'
export * from './sellItem'
export * from './updateLearnedRecipes'
export * from './makeRecipe'
export * from './upgradeTool'
export * from './purchaseCow'
export * from './addCowToInventory'
export * from './sellCow'
export * from './removeCowFromInventory'

/**
 * @param {farmhand.state} state
 * @param {string} cowId
 * @param {Function(farmhand.cow)} fn Must return the modified cow or
 * undefined.
 * @returns {farmhand.state}
 */
export const modifyCow = (state, cowId, fn) => {
  const cowInventory = [...state.cowInventory]
  const cow = cowInventory.find(({ id }) => id === cowId)
  const cowIndex = cowInventory.indexOf(cow)

  cowInventory[cowIndex] = {
    ...cow,
    ...fn(cow),
  }

  return {
    ...state,
    cowInventory,
  }
}

/**
 * @param {farmhand.state} state
 * @param {farmhand.cow} cow
 * @param {boolean} doAutomaticallyHug
 * @returns {farmhand.state}
 */
export const changeCowAutomaticHugState = (state, cow, doAutomaticallyHug) => {
  if (
    (doAutomaticallyHug && !areHuggingMachinesInInventory(state.inventory)) ||
    // TODO: This Boolean cast is needed for backwards compatibility. Remove it
    // after 10/1/2020.
    Boolean(cow.isUsingHuggingMachine) === doAutomaticallyHug
  ) {
    return state
  }

  state = modifyCow(state, cow.id, cow => ({
    ...cow,
    isUsingHuggingMachine: doAutomaticallyHug,
  }))

  state = doAutomaticallyHug
    ? decrementItemFromInventory(state, HUGGING_MACHINE_ITEM_ID)
    : addItemToInventory(state, itemsMap[HUGGING_MACHINE_ITEM_ID])

  return state
}

/**
 * @param {farmhand.state} state
 * @param {farmhand.cow} cow
 * @param {boolean} doAdd If true, cow will be added to the breeding pen. If
 * false, they will be removed.
 * @returns {farmhand.state}
 */
export const changeCowBreedingPenResident = (state, cow, doAdd) => {
  const { cowBreedingPen } = state
  const { cowId1, cowId2 } = cowBreedingPen
  const isPenFull = cowId1 !== null && cowId2 !== null
  const isCowInPen = cowId1 === cow.id || cowId2 === cow.id
  let newCowBreedingPen = { ...cowBreedingPen }

  if (doAdd) {
    if (isPenFull || isCowInPen) {
      return state
    }

    const cowId = cowId1 === null ? 'cowId1' : 'cowId2'
    newCowBreedingPen = { ...newCowBreedingPen, [cowId]: cow.id }
  } else {
    if (!isCowInPen) {
      return state
    }

    if (cowId1 === cow.id) {
      newCowBreedingPen = {
        ...newCowBreedingPen,
        cowId1: newCowBreedingPen.cowId2,
      }
    }

    newCowBreedingPen = { ...newCowBreedingPen, cowId2: null }
  }

  return {
    ...state,
    cowBreedingPen: {
      ...newCowBreedingPen,
      daysUntilBirth: COW_GESTATION_PERIOD_DAYS,
    },
  }
}

/**
 * @param {farmhand.state} state
 * @param {number} fieldId
 * @returns {farmhand.state}
 */
export const purchaseField = (state, fieldId) => {
  const { field, money, purchasedField } = state
  if (purchasedField >= fieldId) {
    return state
  }

  const { columns, price, rows } = PURCHASEABLE_FIELD_SIZES.get(fieldId)

  return {
    purchasedField: fieldId,
    field: nullArray(rows).map((_, row) =>
      nullArray(columns).map(
        (_, column) => (field[row] && field[row][column]) || null
      )
    ),
    money: moneyTotal(money, -price),
  }
}

/**
 * @param {farmhand.state} state
 * @param {number} x
 * @param {number} y
 * @returns {farmhand.state}
 */
export const waterPlot = (state, x, y) => {
  const plotContent = state.field[y][x]

  if (!plotContent || getPlotContentType(plotContent) !== itemType.CROP) {
    return state
  }

  return modifyFieldPlotAt(state, x, y, crop => ({
    ...crop,
    wasWateredToday: true,
  }))
}

/**
 * @param {farmhand.state} state
 * @param {number} combineId
 * @returns {farmhand.state}
 */
export const purchaseCombine = (state, combineId) => {
  const { money, purchasedCombine } = state

  if (purchasedCombine >= combineId) {
    return state
  }

  return {
    purchasedCombine: combineId,
    money: moneyTotal(money, -PURCHASEABLE_COMBINES.get(combineId).price),
  }
}

/**
 * @param {farmhand.state} state
 * @param {number} smelterId
 * @returns {farmhand.state}
 */
export const purchaseSmelter = (state, smelterId) => {
  const { money, purchasedSmelter } = state

  if (purchasedSmelter >= smelterId) return state

  state = {
    ...state,
    purchasedSmelter: smelterId,
    money: moneyTotal(money, -PURCHASEABLE_SMELTERS.get(smelterId).price),
  }

  state = showNotification(state, FORGE_AVAILABLE_NOTIFICATION)

  return updateLearnedRecipes(state)
}

/**
 * @param {farmhand.state} state
 * @param {number} cowPenId
 * @returns {farmhand.state}
 */
export const purchaseCowPen = (state, cowPenId) => {
  const { money, purchasedCowPen } = state

  if (purchasedCowPen >= cowPenId) {
    return state
  }

  return {
    purchasedCowPen: cowPenId,
    money: moneyTotal(money, -PURCHASEABLE_COW_PENS.get(cowPenId).price),
  }
}

/**
 * @param {farmhand.state} state
 * @returns {farmhand.state}
 */
export const purchaseStorageExpansion = state => {
  const { money, inventoryLimit } = state
  const storageUpgradeCost = getCostOfNextStorageExpansion(inventoryLimit)

  if (money < storageUpgradeCost || inventoryLimit === -1) {
    return state
  }

  return {
    ...state,
    inventoryLimit: inventoryLimit + STORAGE_EXPANSION_AMOUNT,
    money: moneyTotal(money, -storageUpgradeCost),
  }
}

/**
 * @param {farmhand.state} state
 * @param {string} cowId
 * @returns {farmhand.state}
 */
export const hugCow = (state, cowId) =>
  modifyCow(state, cowId, cow =>
    cow.happinessBoostsToday >= MAX_DAILY_COW_HUG_BENEFITS
      ? cow
      : {
          happiness: Math.min(1, cow.happiness + COW_HUG_BENEFIT),
          happinessBoostsToday: cow.happinessBoostsToday + 1,
        }
  )

/**
 * @param {farmhand.state} state
 * @param {string} cowId
 * @returns {farmhand.state}
 */
export const offerCow = (state, cowId) => {
  state = { ...state, cowIdOfferedForTrade: cowId }

  return state
}

/**
 * @param {farmhand.state} state
 * @param {string} cowId
 * @returns {farmhand.state}
 */
export const withdrawCow = (state, cowId) => {
  const { cowIdOfferedForTrade } = state

  if (cowId === cowIdOfferedForTrade) {
    state = { ...state, cowIdOfferedForTrade: '' }
  }

  return state
}

/**
 * @param {farmhand.state} state
 * @param {string} newName
 * @param {string} cowId
 * @returns {farmhand.state}
 */
export const changeCowName = (state, cowId, newName) =>
  modifyCow(state, cowId, () => ({
    name: newName.slice(0, MAX_ANIMAL_NAME_LENGTH),
  }))

/**
 * @param {farmhand.state} state
 * @param {farmhand.cow} cow
 * @returns {farmhand.state}
 */
export const selectCow = (state, { id }) => ({ ...state, selectedCowId: id })

/**
 * @param {farmhand.state} state
 * @param {farmhand.state} prevState
 * @returns {farmhand.state}
 */
export const updateAchievements = (state, prevState) =>
  achievements.reduce((state, achievement) => {
    if (
      !state.completedAchievements[achievement.id] &&
      achievement.condition(state, prevState)
    ) {
      state = {
        ...achievement.reward(state),
        completedAchievements: {
          ...state.completedAchievements,
          [achievement.id]: true,
        },
      }

      state = showNotification(
        state,
        ACHIEVEMENT_COMPLETED`${achievement}`,
        'success'
      )
    }

    return state
  }, state)

/**
 * @param {farmhand.state} state
 * @param {number} adjustmentAmount This should be a negative number if the
 * loan is being paid down, positive if a loan is being taken out.
 * @returns {farmhand.state}
 */
export const adjustLoan = (state, adjustmentAmount) => {
  const loanBalance = moneyTotal(state.loanBalance, adjustmentAmount)
  const money = moneyTotal(state.money, adjustmentAmount)

  if (loanBalance === 0 && adjustmentAmount < 0) {
    state = showNotification(state, LOAN_PAYOFF``, 'success')
  } else if (adjustmentAmount > 0) {
    // Player is taking out a new loan
    state = {
      ...showNotification(state, LOAN_INCREASED`${loanBalance}`, 'info'),
      loansTakenOut: state.loansTakenOut + 1,
    }
  }

  return {
    ...state,
    loanBalance,
    money,
  }
}

/**
 * @param {farmhand.state} state
 * @param {function(farmhand.state, number, number)} fieldFn
 * @param {number} rangeRadius
 * @param {number} x
 * @param {number} y
 * @param {...any} args Passed to fieldFn.
 * @returns {farmhand.state}
 */
export const forRange = (
  state,
  fieldFn,
  rangeRadius,
  plotX,
  plotY,
  ...args
) => {
  const startX = Math.max(plotX - rangeRadius, 0)
  const endX = Math.min(plotX + rangeRadius, state.field[0].length - 1)
  const startY = Math.max(plotY - rangeRadius, 0)
  const endY = Math.min(plotY + rangeRadius, state.field.length - 1)

  for (let y = startY; y <= endY; y++) {
    for (let x = startX; x <= endX; x++) {
      state = fieldFn(state, x, y, ...args)
    }
  }

  return state
}

/**
 * @param {farmhand.state} state
 * @param {string} peerId The peer to add
 * @returns {farmhand.state}
 */
export const addPeer = (state, peerId) => {
  const peers = { ...state.peers }
  peers[peerId] = null

  return { ...state, peers }
}

/**
 * @param {farmhand.state} state
 * @param {string} peerId The peer to remove
 * @returns {farmhand.state}
 */
export const removePeer = (state, peerId) => {
  const peers = { ...state.peers }
  delete peers[peerId]

  return { ...state, peers }
}

/**
 * @param {farmhand.state} state
 * @param {string} peerId The peer to update
 * @param {Object} state
 * @returns {farmhand.state}
 */
export const updatePeer = (state, peerId, peerState) => {
  const peers = { ...state.peers }
  peers[peerId] = peerState

  // Out of date peer clients may not provide pendingPeerMessages, so default
  // it here.
  const { pendingPeerMessages = [] } = peerState

  return {
    ...state,
    peers,
    latestPeerMessages: [
      ...pendingPeerMessages,
      ...state.latestPeerMessages,
    ].slice(0, MAX_LATEST_PEER_MESSAGES),
  }
}

/**
 * @param {farmhand.state} state
 * @param {string} peerMessage
 * @param {string?} [severity='info']
 * @returns {farmhand.state}
 */
export const prependPendingPeerMessage = (
  state,
  message,
  severity = 'info'
) => {
  return {
    ...state,
    pendingPeerMessages: [
      { id: state.id, message, severity },
      ...state.pendingPeerMessages,
    ].slice(0, MAX_PENDING_PEER_MESSAGES),
  }
}
