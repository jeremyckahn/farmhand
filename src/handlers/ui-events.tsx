/**
 * @typedef {farmhand.item} item
 * @typedef {farmhand.keg} keg
 * @typedef {farmhand.grape} grape
 */
import { saveAs } from 'file-saver'
import globalWindow from 'global/window.js'

import {
  moneyTotal,
  reduceByPersistedKeys,
  transformStateDataForImport,
} from '../utils/index.js'
import { DEFAULT_ROOM, TOOLBELT_FIELD_MODES } from '../constants.js'
import { dialogView, fieldMode, stageFocusType } from '../enums.js'
import {
  DISCONNECTING_FROM_SERVER,
  INVALID_DATA_PROVIDED,
  PROGRESS_SAVED_MESSAGE,
  UPDATE_AVAILABLE,
} from '../strings.js'

import {
  clearPlot,
  fertilizePlot,
  harvestPlot,
  minePlot,
  plantInPlot,
  waterPlot,
} from '../game-logic/reducers/index.js'
import { randomNumberService } from '../common/services/randomNumber.js'

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
    // @ts-expect-error
    this.purchaseItem(item, howMany)
  },

  /**
   * @param {farmhand.recipe} recipe
   * @param {number} [howMany=1]
   */
  handleMakeRecipeClick(recipe, howMany = 1) {
    // @ts-expect-error
    this.makeRecipe(recipe, howMany)
  },

  /**
   * @param {item} fermentationRecipe
   * @param {number} [howMany=1]
   */
  handleMakeFermentationRecipeClick(fermentationRecipe, howMany = 1) {
    // @ts-expect-error
    this.makeFermentationRecipe(fermentationRecipe, howMany)
  },

  /**
   * @param {grape} grape
   * @param {number} [howMany=1]
   */
  handleMakeWineClick(grape, howMany = 1) {
    // @ts-expect-error
    this.makeWine(grape, howMany)
  },

  /**
   * @param {keg} keg
   */
  handleSellKegClick(keg) {
    // @ts-expect-error
    this.sellKeg(keg)
  },

  /**
   * @param {keg} keg
   */
  handleThrowAwayKegClick(keg) {
    // @ts-expect-error
    this.removeKegFromCellar(keg.id)
  },

  /**
   * @param {farmhand.upgradesMetadatum} upgrade
   */
  handleUpgradeTool(upgrade) {
    // @ts-expect-error
    this.upgradeTool(upgrade)
  },

  /**
   * @param {farmhand.cow} cow
   */
  handleCowPurchaseClick(cow) {
    // @ts-expect-error
    this.purchaseCow(cow)
  },

  /**
   * @param {farmhand.cow} cow
   */
  handleCowSellClick(cow) {
    // @ts-expect-error
    this.sellCow(cow)
  },

  /**
   * @param {farmhand.cow} cow
   */
  handleCowTradeClick(cow) {
    // @ts-expect-error
    this.tradeForPeerCow(cow)
  },

  /**
   * @param {React.ChangeEvent<HTMLInputElement>} e
   * @param {farmhand.cow} cow
   */
  handleCowAutomaticHugChange({ target: { checked } }, cow) {
    // @ts-expect-error
    this.changeCowAutomaticHugState(cow, checked)
  },

  /**
   * @param {React.ChangeEvent<HTMLInputElement>} e
   * @param {farmhand.cow} cow
   */
  handleCowBreedChange({ target }, cow) {
    const { checked } = target
    // @ts-expect-error
    this.changeCowBreedingPenResident(cow, checked)
  },

  /**
   * @param {farmhand.cow} cow
   */
  handleCowHugClick(cow) {
    // @ts-expect-error
    this.hugCow(cow.id)
  },

  /**
   * @param {farmhand.cow} cow
   */
  handleCowOfferClick(cow) {
    // @ts-expect-error
    this.offerCow(cow.id)
  },

  /**
   * @param {farmhand.cow} cow
   */
  handleCowWithdrawClick(cow) {
    // @ts-expect-error
    this.withdrawCow(cow.id)
  },

  /**
   * @param {React.ChangeEvent<HTMLInputElement>} e
   * @param {farmhand.cow} cow
   */
  handleCowNameInputChange({ target }, cow) {
    const { value } = target
    // @ts-expect-error
    this.changeCowName(cow.id, value)
  },

  /**
   * @param {item} item
   * @param {number} [howMany=1]
   */
  handleItemSellClick(item, howMany = 1) {
    // @ts-expect-error
    this.sellItem(item, howMany)
  },

  /**
   * @param {React.ChangeEvent<HTMLSelectElement>} e
   */
  handleViewChange({ target }) {
    const { value } = target
    // @ts-expect-error
    this.setState({
      stageFocus: value as farmhand.stageFocusType,
    })
  },

  /**
   * @param {farmhand.stageFocusType} stageFocus
   */
  handleViewChangeButtonClick(stageFocus) {
    // @ts-expect-error
    this.setState({ stageFocus })
  },

  /**
   * @param {farmhand.fieldMode} selectedFieldMode
   */
  handleFieldModeSelect(selectedFieldMode) {
    // @ts-expect-error
    this.setState(({ selectedItemId }) => ({
      selectedItemId:
        selectedFieldMode !== PLANT ||
        TOOLBELT_FIELD_MODES.has(selectedFieldMode)
          ? ''
          : selectedItemId,
      fieldMode: selectedFieldMode,
    }))
  },

  /**
   * @param {item} item
   */
  handleItemSelectClick({ id, enablesFieldMode }) {
    // @ts-expect-error
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
      fieldMode: fieldModeValue,
      hoveredPlotRangeSize: rangeRadius,
      selectedItemId,
      // @ts-expect-error
    } = this.state

    if (fieldModeValue === PLANT) {
      // @ts-expect-error
      this.forRange(plantInPlot, rangeRadius, x, y, selectedItemId)
    } else if (fieldModeValue === HARVEST) {
      // @ts-expect-error
      this.forRange(harvestPlot, rangeRadius, x, y)
    } else if (fieldModeValue === MINE) {
      // @ts-expect-error
      this.forRange(minePlot, rangeRadius, x, y)
    } else if (fieldModeValue === CLEANUP) {
      // @ts-expect-error
      this.forRange(clearPlot, rangeRadius, x, y)
    } else if (fieldModeValue === WATER) {
      // @ts-expect-error
      this.forRange(waterPlot, rangeRadius, x, y)
    } else if (fieldModeValue === FERTILIZE) {
      // @ts-expect-error
      this.forRange(fertilizePlot, rangeRadius, x, y)
    } else if (fieldModeValue === SET_SPRINKLER) {
      // @ts-expect-error
      this.setSprinkler(x, y)
    } else if (fieldModeValue === SET_SCARECROW) {
      // @ts-expect-error
      this.setScarecrow(x, y)
    }
  },

  /**
   * @param {number} range
   */
  handleFieldActionRangeChange(range) {
    // @ts-expect-error
    this.setState(() => ({ hoveredPlotRangeSize: range }))
  },

  handleClickEndDayButton() {
    // @ts-expect-error
    this.incrementDay()

    // Prevent the player from spamming the End Day button
    // https://www.reddit.com/r/incremental_games/comments/jusn9i/farmhand_updates_for_November_2020/gcmi6x6/?context=3
    const activeElement = document.activeElement as HTMLElement
    activeElement.blur()
  },

  /**
   * @param {number} amount
   */
  handleAddMoneyClick(amount) {
    // @ts-expect-error
    this.setState(({ money }) => ({ money: moneyTotal(money, amount) }))
  },

  handleClearPersistedDataClick() {
    // @ts-expect-error
    this.clearPersistedData()
  },

  handleWaterAllPlotsClick() {
    // @ts-expect-error
    this.waterAllPlots(this.state)
  },

  /**
   * @param {number} fieldId
   */
  handleFieldPurchase(fieldId) {
    // @ts-expect-error
    this.purchaseField(fieldId)
  },

  /**
   * @param {number} forestId
   */
  handleForestPurchase(forestId) {
    // @ts-expect-error
    this.purchaseForest(forestId)
  },

  /**
   * @param {number} combineId
   */
  handleCombinePurchase(combineId) {
    // @ts-expect-error
    this.purchaseCombine(combineId)
  },

  /**
   * @param {number} composterId
   */
  handleComposterPurchase(composterId) {
    // @ts-expect-error
    this.purchaseComposter(composterId)
  },

  /**
   * @param {number} smelterId
   */
  handleSmelterPurchase(smelterId) {
    // @ts-expect-error
    this.purchaseSmelter(smelterId)
  },

  /**
   * @param {number} cowPenId
   */
  handleCowPenPurchase(cowPenId) {
    // @ts-expect-error
    this.purchaseCowPen(cowPenId)
  },

  /**
   * @param {number} cellarId
   */
  handleCellarPurchase(cellarId) {
    // @ts-expect-error
    this.purchaseCellar(cellarId)
  },

  handleStorageExpansionPurchase() {
    // @ts-expect-error
    this.purchaseStorageExpansion()
  },

  /**
   * @param {boolean} [setOpen]
   */
  handleMenuToggle(setOpen = /** @type {boolean | undefined} */ undefined) {
    // @ts-expect-error
    this.setState(({ isMenuOpen }) => ({
      isMenuOpen: setOpen == null ? !isMenuOpen : setOpen,
    }))
  },

  handleClickNextMenuButton() {
    // @ts-expect-error
    this.focusNextView()
  },

  handleClickPreviousMenuButton() {
    // @ts-expect-error
    this.focusPreviousView()
  },

  /**
   * @param {farmhand.cow} cow
   */
  handleCowSelect(cow) {
    // @ts-expect-error
    this.selectCow(cow)
  },

  /**
   * @param {farmhand.cow} cow
   */
  handleCowClick(cow) {
    // @ts-expect-error
    this.selectCow(cow)
    // @ts-expect-error
    this.hugCow(cow.id)
  },

  handleCowPenUnmount() {
    // @ts-expect-error
    this.setState({ selectedCowId: '' })
  },

  /**
   * @param {farmhand.dialogView} selectedDialogView
   */
  handleClickDialogViewButton(selectedDialogView) {
    // @ts-expect-error
    this.openDialogView(selectedDialogView)
  },

  handleCloseDialogView() {
    // @ts-expect-error
    if (this.state.isAwaitingCowTradeRequest) return

    // @ts-expect-error
    this.closeDialogView()
  },

  handleDialogViewExited() {
    // @ts-expect-error
    this.setState({ currentDialogView: dialogView.NONE })
  },

  /**
   * @param {number} paydownAmount
   */
  handleClickLoanPaydownButton(paydownAmount) {
    // @ts-expect-error
    this.adjustLoan(-paydownAmount)
  },

  /**
   * @param {number} loanAmount
   */
  handleClickTakeOutLoanButton(loanAmount) {
    // @ts-expect-error
    this.adjustLoan(loanAmount)
  },

  handleExportDataClick() {
    const blob = new Blob(
      // @ts-expect-error
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

    fileReader.addEventListener('loadend', eImport => {
      try {
        const target = eImport.target as FileReader
        const json = String(target.result)
        const parsedJson = JSON.parse(json)
        const transformedStateData = transformStateDataForImport(parsedJson)
        const state = reduceByPersistedKeys(transformedStateData)

        if (
          Object.keys(state).some(
            // @ts-expect-error
            key => typeof this.state[key] !== typeof state[key]
          )
        ) {
          throw new Error(INVALID_DATA_PROVIDED)
        }

        // @ts-expect-error
        this.setState({
          ...transformStateDataForImport({
            // @ts-expect-error
            ...this.createInitialState(),
            ...state,
          }),
          hasBooted: true,
        })

        // @ts-expect-error
        this.showNotification('Data loaded!', 'success')
      } catch (e) {
        console.error(e)
        // @ts-expect-error
        this.showNotification(/** @type {Error} */ e.message, 'error')
      }
    })

    fileReader.readAsText(file.slice())
  },

  async handleSaveButtonClick() {
    // @ts-expect-error
    await this.persistState()
    // @ts-expect-error
    this.showNotification(PROGRESS_SAVED_MESSAGE, 'info')
  },

  /**
   * @param {string} farmName
   */
  handleFarmNameUpdate(farmName) {
    // @ts-expect-error
    this.setState({ farmName })
  },

  handleCombineEnabledChange(_e, enableCombine) {
    // @ts-expect-error
    this.setState({ isCombineEnabled: enableCombine })
  },

  handleUseAlternateEndDayButtonPositionChange(
    _e,
    useAlternateEndDayButtonPosition
  ) {
    // @ts-expect-error
    this.setState({ useAlternateEndDayButtonPosition })
  },

  handleAllowCustomPeerCowNamesChange(_e, allowCustomPeerCowNames) {
    // @ts-expect-error
    this.setState({ allowCustomPeerCowNames })
  },

  handleShowHomeScreenChange(_e, showHomeScreen) {
    // @ts-expect-error
    if (this.state.stageFocus === stageFocusType.HOME && !showHomeScreen) {
      // @ts-expect-error
      this.focusNextView()
    }

    // @ts-expect-error
    this.setState({ showHomeScreen })
  },

  handleShowNotificationsChange({ target: { checked } }) {
    // @ts-expect-error
    this.setState({ showNotifications: checked })
  },

  handleClickNotificationIndicator() {
    // @ts-expect-error
    this.openDialogView(dialogView.FARMERS_LOG)
  },

  /**
   * @param {boolean} goOnline
   */
  handleOnlineToggleChange(goOnline) {
    if (!goOnline) {
      // @ts-expect-error
      this.showNotification(DISCONNECTING_FROM_SERVER, 'info')
    }

    // @ts-expect-error
    this.setState(({ room }) =>
      goOnline
        ? {
            redirect: `/online/${encodeURIComponent(room)}`,
          }
        : {
            redirect: '/',
            cowIdOfferedForTrade: '',
          }
    )
  },

  /**
   * @param {string} room
   */
  handleRoomChange(room) {
    // @ts-expect-error
    this.setState(() => ({
      room,
      redirect: `/online/${encodeURIComponent(room.trim() || DEFAULT_ROOM)}`,
    }))
  },

  handleActivePlayerButtonClick() {
    // @ts-expect-error
    this.openDialogView(dialogView.ONLINE_PEERS)
  },

  /**
   * @param {string} seed
   */
  handleRNGSeedChange(seed) {
    const { origin, pathname, search, hash } = globalWindow.location
    const queryParams = new URLSearchParams(search)
    const trimmedSeed = seed.trim()

    if (trimmedSeed === '') {
      randomNumberService.unseedRandomNumber()
      queryParams.delete('seed')

      // @ts-expect-error
      this.showNotification('Random seed reset', 'info')
    } else {
      randomNumberService.seedRandomNumber(trimmedSeed)
      queryParams.set('seed', trimmedSeed)

      // @ts-expect-error
      this.showNotification(`Random seed set to "${trimmedSeed}"`, 'success')
    }

    const newQueryParams = queryParams.toString()
    const newSearch = newQueryParams.length > 0 ? `?${newQueryParams}` : ''

    const newUrl = `${origin}${pathname}${newSearch}${hash}`
    globalWindow.history.replaceState({}, '', newUrl)
  },

  /**
   * @param {boolean} isChatOpen
   */
  handleChatRoomOpenStateChange(isChatOpen) {
    // @ts-expect-error
    this.setState({ isChatOpen })
  },

  /**
   * @param {(reloadPage?: boolean) => Promise<void>} updateServiceWorker
   */
  handleGameUpdateAvailable(updateServiceWorker) {
    // @ts-expect-error
    this.showNotification(UPDATE_AVAILABLE, 'success', () => {
      updateServiceWorker(true)
    })
  },
}
