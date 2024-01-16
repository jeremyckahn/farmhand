/**
 * @typedef {import("../index").farmhand.item} item
 * @typedef {import("../index").farmhand.keg} keg
 * @typedef {import("../index").farmhand.cow} farmhand.cow
 */
import { saveAs } from 'file-saver'
import window from 'global/window'

import {
  moneyTotal,
  reduceByPersistedKeys,
  transformStateDataForImport,
} from '../utils'
import { DEFAULT_ROOM, TOOLBELT_FIELD_MODES } from '../constants'
import { dialogView, fieldMode, stageFocusType } from '../enums'
import {
  DISCONNECTING_FROM_SERVER,
  INVALID_DATA_PROVIDED,
  PROGRESS_SAVED_MESSAGE,
} from '../strings'

import {
  clearPlot,
  fertilizePlot,
  harvestPlot,
  minePlot,
  plantInPlot,
  waterPlot,
} from '../game-logic/reducers'
import { randomNumberService } from '../common/services/randomNumber'

const {
  CLEANUP,
  FERTILIZE,
  HARVEST,
  MINE,
  PLANT,
  SET_SCARECROW,
  SET_SPRINKLER,
  WATER,
} = fieldMode

// All of the functions exported here are bound to the Farmhand component
// class. See the definition of initInputHandlers:
// https://github.com/search?q=repo%3Ajeremyckahn%2Ffarmhand+path%3A**%2FFarmhand.js+%2FeventHandlers.*bind%2F&type=code
export default {
  /**
   * @param {item} item
   * @param {number} [howMany=1]
   */
  handleItemPurchaseClick(item, howMany = 1) {
    this.purchaseItem(item, howMany)
  },

  /**
   * @param {farmhand.recipe} recipe
   * @param {number} [howMany=1]
   */
  handleMakeRecipeClick(recipe, howMany = 1) {
    this.makeRecipe(recipe, howMany)
  },

  /**
   * @param {item} fermentationRecipe
   * @param {number} [howMany=1]
   */
  handleMakeFermentationRecipeClick(fermentationRecipe, howMany = 1) {
    this.makeFermentationRecipe(fermentationRecipe, howMany)
  },

  /**
   * @param {keg} keg
   */
  handleSellKegClick(keg) {
    this.sellKeg(keg)
  },

  /**
   * @param {keg} keg
   */
  handleThrowAwayKegClick(keg) {
    this.removeKegFromCellar(keg.id)
  },

  /**
   * @param {farmhand.upgrade} upgrade
   */
  handleUpgradeTool(upgrade) {
    this.upgradeTool(upgrade)
  },

  /**
   * @param {farmhand.cow} cow
   */
  handleCowPurchaseClick(cow) {
    this.purchaseCow(cow)
  },

  /**
   * @param {farmhand.cow} cow
   */
  handleCowSellClick(cow) {
    this.sellCow(cow)
  },

  /**
   * @param {farmhand.cow} cow
   */
  handleCowTradeClick(cow) {
    this.tradeForPeerCow(cow)
  },

  /**
   * @param {React.SyntheticEvent} e
   * @param {farmhand.cow} cow
   */
  handleCowAutomaticHugChange({ target: { checked } }, cow) {
    this.changeCowAutomaticHugState(cow, checked)
  },

  /**
   * @param {React.SyntheticEvent} e
   * @param {farmhand.cow} cow
   */
  handleCowBreedChange({ target: { checked } }, cow) {
    this.changeCowBreedingPenResident(cow, checked)
  },

  /**
   * @param {farmhand.cow} cow
   */
  handleCowHugClick(cow) {
    this.hugCow(cow.id)
  },

  /**
   * @param {farmhand.cow} cow
   */
  handleCowOfferClick(cow) {
    this.offerCow(cow.id)
  },

  /**
   * @param {farmhand.cow} cow
   */
  handleCowWithdrawClick(cow) {
    this.withdrawCow(cow.id)
  },

  /**
   * @param {React.SyntheticEvent} e
   * @param {farmhand.cow} cow
   */
  handleCowNameInputChange({ target: { value } }, cow) {
    this.changeCowName(cow.id, value)
  },

  /**
   * @param {item} item
   * @param {number} [howMany=1]
   */
  handleItemSellClick(item, howMany = 1) {
    this.sellItem(item, howMany)
  },

  /**
   * @param {React.SyntheticEvent} e
   */
  handleViewChange({ target: { value } }) {
    this.setState({ stageFocus: value })
  },

  /**
   * @param {farmhand.module:enums.stageFocusType} stageFocus
   */
  handleViewChangeButtonClick(stageFocus) {
    this.setState({ stageFocus })
  },

  /**
   * @param {farmhand.module:enums.fieldMode} fieldMode
   */
  handleFieldModeSelect(fieldMode) {
    this.setState(({ selectedItemId }) => ({
      selectedItemId:
        fieldMode !== PLANT || TOOLBELT_FIELD_MODES.has(fieldMode)
          ? ''
          : selectedItemId,
      fieldMode,
    }))
  },

  /**
   * @param {item} item
   */
  handleItemSelectClick({ id, enablesFieldMode }) {
    this.setState({
      fieldMode: enablesFieldMode,
      selectedItemId: id,
    })
  },

  /**
   * @param {number} x
   * @param {number} y
   */
  handlePlotClick(x, y) {
    const {
      fieldMode,
      hoveredPlotRangeSize: rangeRadius,
      selectedItemId,
    } = this.state

    if (fieldMode === PLANT) {
      this.forRange(plantInPlot, rangeRadius, x, y, selectedItemId)
    } else if (fieldMode === HARVEST) {
      this.forRange(harvestPlot, rangeRadius, x, y)
    } else if (fieldMode === MINE) {
      this.forRange(minePlot, rangeRadius, x, y)
    } else if (fieldMode === CLEANUP) {
      this.forRange(clearPlot, rangeRadius, x, y)
    } else if (fieldMode === WATER) {
      this.forRange(waterPlot, rangeRadius, x, y)
    } else if (fieldMode === FERTILIZE) {
      this.forRange(fertilizePlot, rangeRadius, x, y)
    } else if (fieldMode === SET_SPRINKLER) {
      this.setSprinkler(x, y)
    } else if (fieldMode === SET_SCARECROW) {
      this.setScarecrow(x, y)
    }
  },

  /**
   * @param {number} range
   */
  handleFieldActionRangeChange(range) {
    this.setState(() => ({ hoveredPlotRangeSize: range }))
  },

  handleClickEndDayButton() {
    this.incrementDay()

    // Prevent the player from spamming the End Day button
    // https://www.reddit.com/r/incremental_games/comments/jusn9i/farmhand_updates_for_november_2020/gcmi6x6/?context=3
    document.activeElement.blur()
  },

  /**
   * @param {number} amount
   */
  handleAddMoneyClick(amount) {
    this.setState(({ money }) => ({ money: moneyTotal(money, amount) }))
  },

  handleClearPersistedDataClick() {
    this.clearPersistedData()
  },

  handleWaterAllPlotsClick() {
    this.waterAllPlots(this.state)
  },

  /**
   * @param {number} fieldId
   */
  handleFieldPurchase(fieldId) {
    this.purchaseField(fieldId)
  },

  /**
   * @param {number} forestId
   */
  handleForestPurchase(forestId) {
    this.purchaseForest(forestId)
  },

  /**
   * @param {number} combineId
   */
  handleCombinePurchase(combineId) {
    this.purchaseCombine(combineId)
  },

  /**
   * @param {number} composterId
   */
  handleComposterPurchase(composterId) {
    this.purchaseComposter(composterId)
  },

  /**
   * @param {number} smelterId
   */
  handleSmelterPurchase(smelterId) {
    this.purchaseSmelter(smelterId)
  },

  /**
   * @param {number} cowPenId
   */
  handleCowPenPurchase(cowPenId) {
    this.purchaseCowPen(cowPenId)
  },

  /**
   * @param {number} cellarId
   */
  handleCellarPurchase(cellarId) {
    this.purchaseCellar(cellarId)
  },

  handleStorageExpansionPurchase() {
    this.purchaseStorageExpansion()
  },

  /**
   * @param {boolean} [setOpen]
   */
  handleMenuToggle(setOpen = null) {
    this.setState(({ isMenuOpen }) => ({
      isMenuOpen: setOpen === null ? !isMenuOpen : setOpen,
    }))
  },

  handleClickNextMenuButton() {
    this.focusNextView()
  },

  handleClickPreviousMenuButton() {
    this.focusPreviousView()
  },

  /**
   * @param {farmhand.cow}
   */
  handleCowSelect(cow) {
    this.selectCow(cow)
  },

  /**
   * @param {farmhand.cow}
   */
  handleCowClick(cow) {
    this.selectCow(cow)
    this.hugCow(cow.id)
  },

  handleCowPenUnmount() {
    this.setState({ selectedCowId: '' })
  },

  /**
   * @param {farmhand.module:enums.dialogView} dialogView
   */
  handleClickDialogViewButton(dialogView) {
    this.openDialogView(dialogView)
  },

  handleCloseDialogView() {
    if (this.state.isAwaitingCowTradeRequest) return

    this.closeDialogView()
  },

  handleDialogViewExited() {
    this.setState({ currentDialogView: dialogView.NONE })
  },

  /**
   * @param {number} paydownAmount
   */
  handleClickLoanPaydownButton(paydownAmount) {
    this.adjustLoan(-paydownAmount)
  },

  /**
   * @param {number} loanAmount
   */
  handleClickTakeOutLoanButton(loanAmount) {
    this.adjustLoan(loanAmount)
  },

  handleExportDataClick() {
    const blob = new Blob(
      [JSON.stringify(reduceByPersistedKeys(this.state), null, 2)],
      {
        type: 'application/json;charset=utf-8',
      }
    )

    const [date] = new Date().toISOString().split('T')

    saveAs(blob, `farmhand-${date}.json`)
  },

  /**
   *
   */
  handleImportDataClick([data]) {
    const [, file] = data
    const fileReader = new FileReader()

    fileReader.addEventListener('loadend', e => {
      try {
        const { result: json } = e.srcElement
        const state = reduceByPersistedKeys(JSON.parse(json))

        if (
          Object.keys(state).some(
            key => typeof this.state[key] !== typeof state[key]
          )
        ) {
          throw new Error(INVALID_DATA_PROVIDED)
        }

        this.setState({
          ...transformStateDataForImport({
            ...this.createInitialState(),
            ...state,
          }),
          hasBooted: true,
        })

        this.showNotification('Data loaded!', 'success')
      } catch (e) {
        console.error(e)
        this.showNotification(e.message, 'error')
      }
    })

    fileReader.readAsText(file.slice())
  },

  async handleSaveButtonClick() {
    await this.persistState()
    this.showNotification(PROGRESS_SAVED_MESSAGE, 'info')
  },

  /**
   * @param {string} farmName
   */
  handleFarmNameUpdate(farmName) {
    this.setState({ farmName })
  },

  handleCombineEnabledChange(_e, enableCombine) {
    this.setState({ isCombineEnabled: enableCombine })
  },

  handleUseAlternateEndDayButtonPositionChange(
    _e,
    useAlternateEndDayButtonPosition
  ) {
    this.setState({ useAlternateEndDayButtonPosition })
  },

  handleAllowCustomPeerCowNamesChange(_e, allowCustomPeerCowNames) {
    this.setState({ allowCustomPeerCowNames })
  },

  handleShowHomeScreenChange(_e, showHomeScreen) {
    if (this.state.stageFocus === stageFocusType.HOME && !showHomeScreen) {
      this.focusNextView()
    }

    this.setState({ showHomeScreen })
  },

  handleShowNotificationsChange({ target: { checked } }) {
    this.setState({ showNotifications: checked })
  },

  handleClickNotificationIndicator() {
    this.openDialogView(dialogView.FARMERS_LOG)
  },

  handleOnlineToggleChange(_e, goOnline) {
    if (!goOnline) {
      this.showNotification(DISCONNECTING_FROM_SERVER, 'info')
    }

    const { room } = this.state

    // Defer this operation to the next thread to prevent this warning:
    //
    // "An update (setState, replaceState, or forceUpdate) was scheduled from
    // inside an update function. Update functions should be pure, with zero
    // side-effects. Consider using componentDidUpdate or a callback."
    setTimeout(
      () =>
        this.setState(() =>
          goOnline
            ? {
                redirect: `/online/${encodeURIComponent(room)}`,
              }
            : {
                redirect: '/',
                cowIdOfferedForTrade: '',
              }
        ),
      1
    )
  },

  handleRoomChange(room) {
    this.setState(() => ({
      redirect: `/online/${encodeURIComponent(room.trim() || DEFAULT_ROOM)}`,
    }))
  },

  handleActivePlayerButtonClick() {
    this.openDialogView(dialogView.ONLINE_PEERS)
  },

  /**
   * @param {string} seed
   */
  handleRNGSeedChange(seed) {
    const { origin, pathname, search, hash } = window.location
    const queryParams = new URLSearchParams(search)
    const trimmedSeed = seed.trim()

    if (trimmedSeed === '') {
      randomNumberService.unseedRandomNumber()
      queryParams.delete('seed')

      this.showNotification('Random seed reset', 'info')
    } else {
      randomNumberService.seedRandomNumber(trimmedSeed)
      queryParams.set('seed', trimmedSeed)

      this.showNotification(`Random seed set to "${trimmedSeed}"`, 'success')
    }

    const newQueryParams = queryParams.toString()
    const newSearch = newQueryParams.length > 0 ? `?${newQueryParams}` : ''

    const newUrl = `${origin}${pathname}${newSearch}${hash}`
    window.history.replaceState({}, '', newUrl)
  },

  /**
   * @param {boolean} isChatOpen
   */
  handleChatRoomOpenStateChange(isChatOpen) {
    this.setState({ isChatOpen })
  },
}
