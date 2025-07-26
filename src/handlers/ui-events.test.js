import { vi } from 'vitest'

import { dialogView, fieldMode, stageFocusType } from '../enums.js'
import { testItem, testRecipe, testState } from '../test-utils/index.js'

import uiEventHandlers from './ui-events.js'

// Mock external dependencies
vi.mock('file-saver', () => ({
  saveAs: vi.fn(),
}))

vi.mock('global/window.js', () => ({
  default: {
    location: {
      origin: 'http://localhost',
      pathname: '/',
      search: '',
      hash: '',
    },
    history: {
      replaceState: vi.fn(),
    },
  },
}))

vi.mock('../common/services/randomNumber.js', () => ({
  randomNumberService: {
    seedRandomNumber: vi.fn(),
    unseedRandomNumber: vi.fn(),
  },
}))

describe('UI Event Handlers', () => {
  let mockContext

  beforeEach(() => {
    // Create a mock context that simulates the Farmhand component
    mockContext = {
      state: {
        selectedItemId: '',
        fieldMode: fieldMode.OBSERVE,
        stageFocus: stageFocusType.HOME,
        hoveredPlotRangeSize: 0,
        isMenuOpen: false,
        money: 500,
        room: 'test-room',
        isAwaitingCowTradeRequest: false,
        currentDialogView: dialogView.NONE,
        showHomeScreen: true,
      },
      setState: vi.fn(),
      purchaseItem: vi.fn(),
      makeRecipe: vi.fn(),
      makeFermentationRecipe: vi.fn(),
      makeWine: vi.fn(),
      sellKeg: vi.fn(),
      removeKegFromCellar: vi.fn(),
      upgradeTool: vi.fn(),
      purchaseCow: vi.fn(),
      sellCow: vi.fn(),
      tradeForPeerCow: vi.fn(),
      changeCowAutomaticHugState: vi.fn(),
      changeCowBreedingPenResident: vi.fn(),
      hugCow: vi.fn(),
      offerCow: vi.fn(),
      withdrawCow: vi.fn(),
      changeCowName: vi.fn(),
      sellItem: vi.fn(),
      forRange: vi.fn(),
      setSprinkler: vi.fn(),
      setScarecrow: vi.fn(),
      incrementDay: vi.fn(),
      clearPersistedData: vi.fn(),
      waterAllPlots: vi.fn(),
      purchaseField: vi.fn(),
      purchaseForest: vi.fn(),
      purchaseCombine: vi.fn(),
      purchaseComposter: vi.fn(),
      purchaseSmelter: vi.fn(),
      purchaseCowPen: vi.fn(),
      purchaseCellar: vi.fn(),
      purchaseStorageExpansion: vi.fn(),
      focusNextView: vi.fn(),
      focusPreviousView: vi.fn(),
      selectCow: vi.fn(),
      openDialogView: vi.fn(),
      closeDialogView: vi.fn(),
      adjustLoan: vi.fn(),
      persistState: vi.fn(),
      showNotification: vi.fn(),
      createInitialState: vi.fn(() => ({})),
    }

    // Mock document.activeElement
    Object.defineProperty(document, 'activeElement', {
      value: { blur: vi.fn() },
      writable: true,
    })

    vi.clearAllMocks()
  })

  describe('handleFieldModeSelect', () => {
    test('switches to selected field mode and clears item selection', () => {
      const handler = uiEventHandlers.handleFieldModeSelect.bind(mockContext)

      handler(fieldMode.WATER)

      expect(mockContext.setState).toHaveBeenCalledWith(expect.any(Function))

      // Test the state updater function
      const stateUpdater = mockContext.setState.mock.calls[0][0]
      const newState = stateUpdater({ selectedItemId: 'test-item' })

      expect(newState).toEqual({
        selectedItemId: '',
        fieldMode: fieldMode.WATER,
      })
    })

    test('keeps selected item when switching to plant mode', () => {
      const handler = uiEventHandlers.handleFieldModeSelect.bind(mockContext)

      handler(fieldMode.PLANT)

      const stateUpdater = mockContext.setState.mock.calls[0][0]
      const newState = stateUpdater({ selectedItemId: 'crop-seed' })

      expect(newState).toEqual({
        selectedItemId: 'crop-seed',
        fieldMode: fieldMode.PLANT,
      })
    })
  })

  describe('handleViewChangeButtonClick', () => {
    test('navigates to selected view', () => {
      const handler = uiEventHandlers.handleViewChangeButtonClick.bind(
        mockContext
      )

      handler(stageFocusType.SHOP)

      expect(mockContext.setState).toHaveBeenCalledWith({
        stageFocus: stageFocusType.SHOP,
      })
    })
  })

  describe('handleItemSelectClick', () => {
    test('selects item and enables its field mode', () => {
      const handler = uiEventHandlers.handleItemSelectClick.bind(mockContext)
      const mockItem = testItem({
        id: 'test-item',
        enablesFieldMode: fieldMode.PLANT,
      })

      handler(mockItem)

      expect(mockContext.setState).toHaveBeenCalledWith({
        fieldMode: fieldMode.PLANT,
        selectedItemId: 'test-item',
      })
    })
  })

  describe('handleMenuToggle', () => {
    test('opens menu when closed', () => {
      const handler = uiEventHandlers.handleMenuToggle.bind(mockContext)

      handler()

      expect(mockContext.setState).toHaveBeenCalledWith(expect.any(Function))

      // Test the state updater function
      const stateUpdater = mockContext.setState.mock.calls[0][0]
      const newState = stateUpdater({ isMenuOpen: false })

      expect(newState).toEqual({ isMenuOpen: true })
    })

    test('opens menu when explicitly requested', () => {
      const handler = uiEventHandlers.handleMenuToggle.bind(mockContext)

      handler(true)

      const stateUpdater = mockContext.setState.mock.calls[0][0]
      const newState = stateUpdater({ isMenuOpen: false })

      expect(newState).toEqual({ isMenuOpen: true })
    })
  })

  describe('handleClickEndDayButton', () => {
    test('advances to next day', () => {
      const handler = uiEventHandlers.handleClickEndDayButton.bind(mockContext)

      handler()

      expect(mockContext.incrementDay).toHaveBeenCalled()
      expect(mockContext.incrementDay).toHaveBeenCalled()
      // Note: blur() is called on activeElement but is hard to test without DOM setup
    })
  })

  describe('handleItemPurchaseClick', () => {
    test('buys one item when quantity not specified', () => {
      const handler = uiEventHandlers.handleItemPurchaseClick.bind(mockContext)
      const mockItem = testItem({ id: 'test-item' })

      handler(mockItem)

      expect(mockContext.purchaseItem).toHaveBeenCalledWith(mockItem, 1)
    })

    test('buys multiple items when quantity specified', () => {
      const handler = uiEventHandlers.handleItemPurchaseClick.bind(mockContext)
      const mockItem = testItem({ id: 'test-item' })

      handler(mockItem, 5)

      expect(mockContext.purchaseItem).toHaveBeenCalledWith(mockItem, 5)
    })
  })

  describe('handleMakeRecipeClick', () => {
    test('crafts one recipe when quantity not specified', () => {
      const handler = uiEventHandlers.handleMakeRecipeClick.bind(mockContext)
      const mockRecipe = testRecipe({ id: 'test-recipe' })

      handler(mockRecipe)

      expect(mockContext.makeRecipe).toHaveBeenCalledWith(mockRecipe, 1)
    })

    test('crafts multiple recipes when quantity specified', () => {
      const handler = uiEventHandlers.handleMakeRecipeClick.bind(mockContext)
      const mockRecipe = testRecipe({ id: 'test-recipe' })

      handler(mockRecipe, 3)

      expect(mockContext.makeRecipe).toHaveBeenCalledWith(mockRecipe, 3)
    })
  })

  describe('handleCowSelect', () => {
    test('chooses cow for interaction', () => {
      const handler = uiEventHandlers.handleCowSelect.bind(mockContext)
      const mockCow = testState().cowForSale

      handler(mockCow)

      expect(mockContext.selectCow).toHaveBeenCalledWith(mockCow)
    })
  })

  describe('handleCowClick', () => {
    test('selects cow and gives it affection', () => {
      const handler = uiEventHandlers.handleCowClick.bind(mockContext)
      const mockCow = testState().cowForSale

      handler(mockCow)

      expect(mockContext.selectCow).toHaveBeenCalledWith(mockCow)
      expect(mockContext.hugCow).toHaveBeenCalledWith('test-cow')
    })
  })

  describe('handleClickDialogViewButton', () => {
    test('displays requested dialog screen', () => {
      const handler = uiEventHandlers.handleClickDialogViewButton.bind(
        mockContext
      )

      handler(dialogView.FARMERS_LOG)

      expect(mockContext.openDialogView).toHaveBeenCalledWith(
        dialogView.FARMERS_LOG
      )
    })
  })

  describe('handleCloseDialogView', () => {
    test('dismisses dialog when not waiting for trade response', () => {
      const handler = uiEventHandlers.handleCloseDialogView.bind(mockContext)

      handler()

      expect(mockContext.closeDialogView).toHaveBeenCalled()
    })

    test('keeps dialog open when waiting for trade response', () => {
      mockContext.state.isAwaitingCowTradeRequest = true
      const handler = uiEventHandlers.handleCloseDialogView.bind(mockContext)

      handler()

      expect(mockContext.closeDialogView).not.toHaveBeenCalled()
    })
  })

  describe('handleDialogViewExited', () => {
    test('clears dialog state after closing', () => {
      const handler = uiEventHandlers.handleDialogViewExited.bind(mockContext)

      handler()

      expect(mockContext.setState).toHaveBeenCalledWith({
        currentDialogView: dialogView.NONE,
      })
    })
  })

  describe('handleFieldActionRangeChange', () => {
    test('adjusts tool range preview size', () => {
      const handler = uiEventHandlers.handleFieldActionRangeChange.bind(
        mockContext
      )

      handler(3)

      expect(mockContext.setState).toHaveBeenCalledWith(expect.any(Function))

      const stateUpdater = mockContext.setState.mock.calls[0][0]
      const newState = stateUpdater({})

      expect(newState).toEqual({ hoveredPlotRangeSize: 3 })
    })
  })

  describe('handleAddMoneyClick', () => {
    test('increases player money by specified amount', () => {
      const handler = uiEventHandlers.handleAddMoneyClick.bind(mockContext)

      handler(1000)

      expect(mockContext.setState).toHaveBeenCalledWith(expect.any(Function))
    })
  })

  describe('handleOnlineToggleChange', () => {
    test('enters multiplayer mode and joins room', () => {
      const handler = uiEventHandlers.handleOnlineToggleChange.bind(mockContext)

      handler(true)

      expect(mockContext.setState).toHaveBeenCalledWith(expect.any(Function))

      const stateUpdater = mockContext.setState.mock.calls[0][0]
      const newState = stateUpdater({ room: 'test-room' })

      expect(newState).toEqual({
        redirect: '/online/test-room',
      })
    })

    test('exits multiplayer mode and returns to single player', () => {
      const handler = uiEventHandlers.handleOnlineToggleChange.bind(mockContext)

      handler(false)

      expect(mockContext.showNotification).toHaveBeenCalled()
      expect(mockContext.setState).toHaveBeenCalledWith(expect.any(Function))

      const stateUpdater = mockContext.setState.mock.calls[0][0]
      const newState = stateUpdater({ room: 'test-room' })

      expect(newState).toEqual({
        redirect: '/',
        cowIdOfferedForTrade: '',
      })
    })
  })

  describe('handleShowHomeScreenChange', () => {
    test('enables home screen display', () => {
      const handler = uiEventHandlers.handleShowHomeScreenChange.bind(
        mockContext
      )

      handler(null, true)

      expect(mockContext.setState).toHaveBeenCalledWith({
        showHomeScreen: true,
      })
    })

    test('navigates away from home when disabling home screen while viewing it', () => {
      mockContext.state.stageFocus = stageFocusType.HOME
      const handler = uiEventHandlers.handleShowHomeScreenChange.bind(
        mockContext
      )

      handler(null, false)

      expect(mockContext.focusNextView).toHaveBeenCalled()
      expect(mockContext.setState).toHaveBeenCalledWith({
        showHomeScreen: false,
      })
    })
  })

  describe('handleRNGSeedChange', () => {
    test('applies custom random seed for reproducible gameplay', () => {
      const handler = uiEventHandlers.handleRNGSeedChange.bind(mockContext)

      handler('test-seed')

      expect(mockContext.showNotification).toHaveBeenCalledWith(
        'Random seed set to "test-seed"',
        'success'
      )
    })

    test('removes custom seed to restore normal randomness', () => {
      const handler = uiEventHandlers.handleRNGSeedChange.bind(mockContext)

      handler('')

      expect(mockContext.showNotification).toHaveBeenCalledWith(
        'Random seed reset',
        'info'
      )
    })
  })

  describe('navigation handlers', () => {
    test('moves to next view', () => {
      const handler = uiEventHandlers.handleClickNextMenuButton.bind(
        mockContext
      )

      handler()

      expect(mockContext.focusNextView).toHaveBeenCalled()
    })

    test('moves to previous view', () => {
      const handler = uiEventHandlers.handleClickPreviousMenuButton.bind(
        mockContext
      )

      handler()

      expect(mockContext.focusPreviousView).toHaveBeenCalled()
    })
  })

  describe('purchase handlers', () => {
    test('expands farm with new field', () => {
      const handler = uiEventHandlers.handleFieldPurchase.bind(mockContext)

      handler(2)

      expect(mockContext.purchaseField).toHaveBeenCalledWith(2)
    })

    test('adds cow pen to farm', () => {
      const handler = uiEventHandlers.handleCowPenPurchase.bind(mockContext)

      handler(1)

      expect(mockContext.purchaseCowPen).toHaveBeenCalledWith(1)
    })

    test('increases inventory capacity', () => {
      const handler = uiEventHandlers.handleStorageExpansionPurchase.bind(
        mockContext
      )

      handler()

      expect(mockContext.purchaseStorageExpansion).toHaveBeenCalled()
    })
  })

  describe('loan handlers', () => {
    test('reduces debt by payment amount', () => {
      const handler = uiEventHandlers.handleClickLoanPaydownButton.bind(
        mockContext
      )

      handler(500)

      expect(mockContext.adjustLoan).toHaveBeenCalledWith(-500)
    })

    test('borrows money increasing debt', () => {
      const handler = uiEventHandlers.handleClickTakeOutLoanButton.bind(
        mockContext
      )

      handler(1000)

      expect(mockContext.adjustLoan).toHaveBeenCalledWith(1000)
    })
  })

  describe('utility handlers', () => {
    test('resets all saved game data', () => {
      const handler = uiEventHandlers.handleClearPersistedDataClick.bind(
        mockContext
      )

      handler()

      expect(mockContext.clearPersistedData).toHaveBeenCalled()
    })

    test('waters entire field at once', () => {
      const handler = uiEventHandlers.handleWaterAllPlotsClick.bind(mockContext)

      handler()

      expect(mockContext.waterAllPlots).toHaveBeenCalledWith(mockContext.state)
    })

    test('shows or hides chat window', () => {
      const handler = uiEventHandlers.handleChatRoomOpenStateChange.bind(
        mockContext
      )

      handler(true)

      expect(mockContext.setState).toHaveBeenCalledWith({ isChatOpen: true })
    })
  })
})
