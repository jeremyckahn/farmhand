/**
 * @module farmhand.reducers
 * @ignore
 */

import {
  MAX_LATEST_PEER_MESSAGES,
  MAX_PENDING_PEER_MESSAGES,
} from '../../constants'
export * from './addItemToInventory'
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
export * from './modifyCow'
export * from './changeCowAutomaticHugState'
export * from './changeCowBreedingPenResident'
export * from './purchaseField'
export * from './waterPlot'
export * from './purchaseCombine'
export * from './purchaseSmelter'
export * from './purchaseCowPen'
export * from './purchaseStorageExpansion'
export * from './hugCow'
export * from './offerCow'
export * from './withdrawCow'
export * from './changeCowName'
export * from './selectCow'
export * from './updateAchievements'
export * from './adjustLoan'
export * from './forRange'
export * from './addPeer'

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
