import { saveAs } from 'file-saver'
import globalWindow from 'global/window.js'

import { DEFAULT_ROOM, TOOLBELT_FIELD_MODES } from '../constants.js'
import { dialogView, fieldMode, stageFocusType } from '../enums.js'
import {
  DISCONNECTING_FROM_SERVER,
  INVALID_DATA_PROVIDED,
  PROGRESS_SAVED_MESSAGE,
  UPDATE_AVAILABLE,
} from '../strings.js'
import {
  moneyTotal,
  reduceByPersistedKeys,
  transformStateDataForImport,
} from '../utils/index.js'

import { randomNumberService } from '../common/services/randomNumber.js'
import Farmhand from '../components/Farmhand/Farmhand.js'
import {
  clearPlot,
  fertilizePlot,
  harvestPlot,
  minePlot,
  plantInPlot,
  waterPlot,
} from '../game-logic/reducers/index.js'

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
  handleItemPurchaseClick(this: Farmhand, item: farmhand.item, howMany = 1) {
    this.purchaseItem(item, howMany)
  },

  handleMakeRecipeClick(this: Farmhand, recipe: farmhand.recipe, howMany = 1) {
    this.makeRecipe(recipe, howMany)
  },

  handleMakeFermentationRecipeClick(
    this: Farmhand,
    fermentationRecipe: farmhand.item,
    howMany = 1
  ) {
    this.makeFermentationRecipe(fermentationRecipe, howMany)
  },

  handleMakeWineClick(this: Farmhand, grape: farmhand.grape, howMany = 1) {
    this.makeWine(grape, howMany)
  },

  handleSellKegClick(this: Farmhand, keg: farmhand.keg) {
    this.sellKeg(keg)
  },

  handleThrowAwayKegClick(this: Farmhand, keg: farmhand.keg) {
    this.removeKegFromCellar(keg.id)
  },

  handleUpgradeTool(this: Farmhand, upgrade: farmhand.upgradesMetadatum) {
    this.upgradeTool(upgrade)
  },

  handleCowPurchaseClick(this: Farmhand, cow: farmhand.cow) {
    this.purchaseCow(cow)
  },

  handleCowSellClick(this: Farmhand, cow: farmhand.cow) {
    this.sellCow(cow)
  },

  handleCowTradeClick(this: Farmhand, cow: farmhand.cow) {
    this.tradeForPeerCow(cow)
  },

  handleCowAutomaticHugChange(
    this: Farmhand,
    { target: { checked } }: React.ChangeEvent<HTMLInputElement>,
    cow: farmhand.cow
  ) {
    this.changeCowAutomaticHugState(cow, checked)
  },

  handleCowBreedChange(
    this: Farmhand,
    { target }: React.ChangeEvent<HTMLInputElement>,
    cow: farmhand.cow
  ) {
    const { checked } = target
    this.changeCowBreedingPenResident(cow, checked)
  },

  handleCowHugClick(this: Farmhand, cow: farmhand.cow) {
    this.hugCow(cow.id)
  },

  handleCowOfferClick(this: Farmhand, cow: farmhand.cow) {
    this.offerCow(cow.id)
  },

  handleCowWithdrawClick(this: Farmhand, cow: farmhand.cow) {
    this.withdrawCow(cow.id)
  },

  handleCowNameInputChange(
    this: Farmhand,
    { target }: React.ChangeEvent<HTMLInputElement>,
    cow: farmhand.cow
  ) {
    const { value } = target
    this.changeCowName(cow.id, value)
  },

  handleItemSellClick(this: Farmhand, item: farmhand.item, howMany = 1) {
    this.sellItem(item, howMany)
  },

  handleViewChange(
    this: Farmhand,
    { target }: React.ChangeEvent<HTMLSelectElement>
  ) {
    const { value } = target
    this.setState({
      stageFocus: value as farmhand.stageFocusType,
    })
  },

  handleViewChangeButtonClick(
    this: Farmhand,
    stageFocus: farmhand.stageFocusType
  ) {
    this.setState({ stageFocus })
  },

  handleFieldModeSelect(this: Farmhand, selectedFieldMode: farmhand.fieldMode) {
    this.setState(({ selectedItemId }) => ({
      selectedItemId:
        selectedFieldMode !== PLANT ||
        (TOOLBELT_FIELD_MODES as Set<farmhand.fieldMode>).has(selectedFieldMode)
          ? ''
          : selectedItemId,
      fieldMode: selectedFieldMode,
    }))
  },

  handleItemSelectClick(
    this: Farmhand,
    { id, enablesFieldMode }: farmhand.item
  ) {
    this.setState({
      fieldMode: enablesFieldMode as farmhand.fieldMode,
      selectedItemId: id,
    })
  },

  handlePlotClick(this: Farmhand, x: number, y: number) {
    const {
      fieldMode: fieldModeValue,
      hoveredPlotRangeSize: rangeRadius,
      selectedItemId,
    } = this.state

    if (fieldModeValue === PLANT) {
      this.forRange(plantInPlot, rangeRadius, x, y, selectedItemId)
    } else if (fieldModeValue === HARVEST) {
      this.forRange(harvestPlot, rangeRadius, x, y)
    } else if (fieldModeValue === MINE) {
      this.forRange(minePlot, rangeRadius, x, y)
    } else if (fieldModeValue === CLEANUP) {
      this.forRange(clearPlot, rangeRadius, x, y)
    } else if (fieldModeValue === WATER) {
      this.forRange(waterPlot, rangeRadius, x, y)
    } else if (fieldModeValue === FERTILIZE) {
      this.forRange(fertilizePlot, rangeRadius, x, y)
    } else if (fieldModeValue === SET_SPRINKLER) {
      this.setSprinkler(x, y)
    } else if (fieldModeValue === SET_SCARECROW) {
      this.setScarecrow(x, y)
    }
  },

  handleFieldActionRangeChange(this: Farmhand, range: number) {
    this.setState(() => ({ hoveredPlotRangeSize: range }))
  },

  handleClickEndDayButton(this: Farmhand) {
    this.incrementDay()

    // Prevent the player from spamming the End Day button
    // https://www.reddit.com/r/incremental_games/comments/jusn9i/farmhand_updates_for_November_2020/gcmi6x6/?context=3
    const activeElement = document.activeElement as HTMLElement
    activeElement?.blur()
  },

  handleAddMoneyClick(this: Farmhand, amount: number) {
    this.setState(({ money }) => ({ money: moneyTotal(money, amount) }))
  },

  handleClearPersistedDataClick(this: Farmhand) {
    this.clearPersistedData()
  },

  handleWaterAllPlotsClick(this: Farmhand) {
    this.waterAllPlots(this.state)
  },

  handleFieldPurchase(this: Farmhand, fieldId: number) {
    this.purchaseField(fieldId)
  },

  handleForestPurchase(this: Farmhand, forestId: number) {
    this.purchaseForest(forestId)
  },

  handleCombinePurchase(this: Farmhand, combineId: number) {
    this.purchaseCombine(combineId)
  },

  handleComposterPurchase(this: Farmhand, composterId: number) {
    this.purchaseComposter(composterId)
  },

  handleSmelterPurchase(this: Farmhand, smelterId: number) {
    this.purchaseSmelter(smelterId)
  },

  handleCowPenPurchase(this: Farmhand, cowPenId: number) {
    this.purchaseCowPen(cowPenId)
  },

  handleCellarPurchase(this: Farmhand, cellarId: number) {
    this.purchaseCellar(cellarId)
  },

  handleStorageExpansionPurchase(this: Farmhand) {
    this.purchaseStorageExpansion()
  },

  handleMenuToggle(this: Farmhand, setOpen: boolean | undefined = undefined) {
    this.setState(({ isMenuOpen }) => ({
      isMenuOpen: setOpen == null ? !isMenuOpen : setOpen,
    }))
  },

  handleClickNextMenuButton(this: Farmhand) {
    this.focusNextView()
  },

  handleClickPreviousMenuButton(this: Farmhand) {
    this.focusPreviousView()
  },

  handleCowSelect(this: Farmhand, cow: farmhand.cow) {
    this.selectCow(cow)
  },

  handleCowClick(this: Farmhand, cow: farmhand.cow) {
    this.selectCow(cow)
    this.hugCow(cow.id)
  },

  handleCowPenUnmount(this: Farmhand) {
    this.setState({ selectedCowId: '' })
  },

  handleClickDialogViewButton(
    this: Farmhand,
    selectedDialogView: farmhand.dialogView
  ) {
    this.openDialogView(selectedDialogView)
  },

  handleCloseDialogView(this: Farmhand) {
    if (this.state.isAwaitingCowTradeRequest) return

    this.closeDialogView()
  },

  handleDialogViewExited(this: Farmhand) {
    this.setState({ currentDialogView: dialogView.NONE })
  },

  handleClickLoanPaydownButton(this: Farmhand, paydownAmount: number) {
    this.adjustLoan(-paydownAmount)
  },

  handleClickTakeOutLoanButton(this: Farmhand, loanAmount: number) {
    this.adjustLoan(loanAmount)
  },

  handleExportDataClick(this: Farmhand) {
    const blob = new Blob(
      [JSON.stringify(reduceByPersistedKeys(this.state), null, 2)],
      {
        type: 'application/json;charset=utf-8',
      }
    )

    const [date] = new Date().toISOString().split('T')

    saveAs(blob, `farmhand-${date}.json`)
  },

  handleImportDataClick(this: Farmhand, [data]: any[]) {
    const [, file] = data
    const fileReader = new FileReader()

    fileReader.addEventListener('loadend', eImport => {
      try {
        const target = eImport.target as FileReader
        const json = String(target?.result)
        const parsedJson = JSON.parse(json)
        const transformedStateData = transformStateDataForImport(parsedJson)
        const state = reduceByPersistedKeys(transformedStateData)

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
        this.showNotification((e as Error).message, 'error')
      }
    })

    fileReader.readAsText(file.slice())
  },

  async handleSaveButtonClick(this: Farmhand) {
    await this.persistState()
    this.showNotification(PROGRESS_SAVED_MESSAGE, 'info')
  },

  handleFarmNameUpdate(this: Farmhand, farmName: string) {
    this.setState({ farmName })
  },

  handleCombineEnabledChange(this: Farmhand, _e: any, enableCombine: boolean) {
    this.setState({ isCombineEnabled: enableCombine })
  },

  handleUseAlternateEndDayButtonPositionChange(
    this: Farmhand,
    _e: any,
    useAlternateEndDayButtonPosition: boolean
  ) {
    this.setState({ useAlternateEndDayButtonPosition })
  },

  handleAllowCustomPeerCowNamesChange(
    this: Farmhand,
    _e: any,
    allowCustomPeerCowNames: boolean
  ) {
    this.setState({ allowCustomPeerCowNames })
  },

  handleShowHomeScreenChange(this: Farmhand, _e: any, showHomeScreen: boolean) {
    if (this.state.stageFocus === stageFocusType.HOME && !showHomeScreen) {
      this.focusNextView()
    }

    this.setState({ showHomeScreen })
  },

  handleShowNotificationsChange(
    this: Farmhand,
    { target: { checked } }: React.ChangeEvent<HTMLInputElement>
  ) {
    this.setState({ showNotifications: checked })
  },

  handleClickNotificationIndicator(this: Farmhand) {
    this.openDialogView(dialogView.FARMERS_LOG)
  },

  handleOnlineToggleChange(this: Farmhand, goOnline: boolean) {
    if (!goOnline) {
      this.showNotification(DISCONNECTING_FROM_SERVER, 'info')
    }

    this.setState(({ room, cowIdOfferedForTrade }) =>
      goOnline
        ? {
            redirect: `/online/${encodeURIComponent(room)}`,
            cowIdOfferedForTrade,
          }
        : {
            redirect: '/',
            cowIdOfferedForTrade: '',
          }
    )
  },

  handleRoomChange(this: Farmhand, room: string) {
    this.setState(() => ({
      room,
      redirect: `/online/${encodeURIComponent(room.trim() || DEFAULT_ROOM)}`,
    }))
  },

  handleActivePlayerButtonClick(this: Farmhand) {
    this.openDialogView(dialogView.ONLINE_PEERS)
  },

  handleRNGSeedChange(this: Farmhand, seed: string) {
    const { origin, pathname, search, hash } = globalWindow.location
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
    globalWindow.history.replaceState({}, '', newUrl)
  },

  handleChatRoomOpenStateChange(this: Farmhand, isChatOpen: boolean) {
    this.setState({ isChatOpen })
  },

  handleGameUpdateAvailable(
    this: Farmhand,
    updateServiceWorker: (reloadPage?: boolean) => Promise<void>
  ) {
    this.showNotification(UPDATE_AVAILABLE, 'success', () => {
      updateServiceWorker(true)
    })
  },
}
