import { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import window from 'global/window.js'
import debounce from 'lodash.debounce'
import { v4 as uuid } from 'uuid'

import * as reducers from '../../game-logic/reducers/index.js'
import eventHandlers from '../../handlers/ui-events.js'

import {
  DEFAULT_ROOM,
  INITIAL_STORAGE_LIMIT,
  STAGE_TITLE_MAP,
  STANDARD_LOAN_AMOUNT,
} from '../../constants.js'
import { scarecrow } from '../../data/items.js'
import {
  dialogView,
  fieldMode,
  stageFocusType,
  toolLevel,
  toolType,
} from '../../enums.js'
import { getData, postData } from '../../fetch-utils.js'
import { PROGRESS_SAVED_MESSAGE } from '../../strings.js'
import { LOAN_INCREASED } from '../../templates.js'
import { createNewField } from '../../utils/createNewField.js'
import { createNewForest } from '../../utils/createNewForest.js'
import { doesMenuObstructStage } from '../../utils/doesMenuObstructStage.js'
import { generateCow } from '../../utils/generateCow.js'
import { getAvailableShopInventory } from '../../utils/getAvailableShopInventory.js'
import { getLevelEntitlements } from '../../utils/getLevelEntitlements.js'
import { getPeerMetadata } from '../../utils/getPeerMetadata.js'
import { getValidatedStageFocusFromHash } from '../../utils/getValidatedStageFocusFromHash.js'
import { getViewList } from '../../utils/getViewList.js'
import {
  removeHashQueryParam,
  setHashQueryParam,
  VIEW_QUERY_PARAM_NAME,
} from '../../utils/hashQueryParams.js'
import { levelAchieved } from '../../utils/levelAchieved.js'
import { moneyTotal } from '../../utils/moneyTotal.js'
import { noop } from '../../utils/noop.js'
import { nullArray } from '../../utils/nullArray.js'
import { reduceByPersistedKeys } from '../../utils/reduceByPersistedKeys.js'
import { sleep } from '../../utils/sleep.js'
import { transformStateDataForImport } from '../../utils/transformStateDataForImport.js'

import { BoundHandlers } from './Farmhand.context.js'
import { FarmhandProps } from './FarmhandReducers.js'
import { FarmhandService } from './FarmhandService.js'
import { getInventoryQuantities } from './helpers/getInventoryQuantities.js'

import { useFarmhandNavigation } from './hooks/useFarmhandNavigation.js'
import { useFarmhandNetwork } from './hooks/useFarmhandNetwork.js'
import {
  useFarmhandDayAdvancement,
  NextDayStateRecord,
} from './hooks/useFarmhandDayAdvancement.js'
import { useFarmhandNotifications } from './hooks/useFarmhandNotifications.js'
import { useFarmhandReducers } from './useFarmhandReducers.js'
import { usePrevious } from './usePrevious.js'

const { CLEANUP, HARVEST, MINE, WATER } = fieldMode

export const useFarmhand = (props: FarmhandProps) => {
  // Extract props properly
  const {
    features: propsFeatures,
    match: { path = '', params: { room: paramRoom } = {} } = {},
  } = props

  const createInitialState = useCallback((): farmhand.state => {
    return {
      activePlayers: null,
      allowCustomPeerCowNames: false,
      cellarInventory: [],
      currentDialogView: dialogView.NONE as dialogView,
      completedAchievements: {},
      cowForSale: generateCow() as farmhand.cow,
      cowBreedingPen: { cowId1: null, cowId2: null, daysUntilBirth: -1 },
      cowColorsPurchased: {},
      cowIdOfferedForTrade: '',
      cowInventory: [],
      cowsSold: {},
      cowsTraded: 0,
      cowTradeTimeoutId: -1,
      cropsHarvested: {},
      dayCount: 0,
      experience: 0,
      farmName: 'Unnamed',
      field: createNewField(),
      fieldMode: fieldMode.OBSERVE as fieldMode,
      forest: createNewForest(),
      treesChopped: 0,
      treeFruitsHarvested: {},
      mulchApplied: {},
      getCowAccept: noop,
      getCowReject: noop,
      getCowTradeRequest: noop,
      getPeerMetadata: noop,
      hasBooted: false,
      hasProducedRainbowFertilizer: false,
      heartbeatTimeoutId: null,
      historicalDailyLosses: [],
      historicalDailyRevenue: [],
      historicalValueAdjustments: [],
      hoveredPlotRangeSize: 0,
      playerId: uuid(),
      inventory: [{ id: scarecrow.id, quantity: 1 }],
      inventoryLimit: INITIAL_STORAGE_LIMIT,
      isAwaitingCowTradeRequest: false,
      isAwaitingNetworkRequest: false,
      isCombineEnabled: false,
      isMenuOpen: !doesMenuObstructStage(),
      itemsSold: {},
      cellarItemsSold: {},
      isChatOpen: false,
      isDialogViewOpen: false,
      isOnline: path.startsWith('/online') ?? false,
      isWaitingForDayToCompleteIncrementing: false,
      learnedRecipes: {},
      loanBalance: STANDARD_LOAN_AMOUNT,
      loansTakenOut: 1,
      money: STANDARD_LOAN_AMOUNT,
      latestNotification: null,
      newDayNotifications: [],
      notificationLog: [],
      peers: {},
      peerRoom: null,
      pendingPeerMessages: [],
      latestPeerMessages: [],
      sendPeerMetadata: null,
      selectedCowId: '',
      selectedForestItemId: '',
      selectedItemId: '',
      priceCrashes: {},
      priceSurges: {},
      profitabilityStreak: 0,
      recipesMade: {},
      record7dayProfitAverage: 0,
      recordProfitabilityStreak: 0,
      recordSingleDayProfit: 0,
      revenue: 0,
      redirect: '',
      room: decodeURIComponent(props.match?.params?.room || DEFAULT_ROOM),
      sendCowAccept: noop,
      sendCowReject: noop,
      purchasedCombine: 0,
      purchasedComposter: 0,
      purchasedCowPen: 0,
      purchasedCellar: 0,
      purchasedField: 0,
      purchasedForest: 0,
      purchasedSmelter: 0,
      purchasedWoodChipper: 0,
      sendCowTradeRequest: noop,
      showHomeScreen: true,
      showNotifications: true,
      stageFocus: stageFocusType.HOME as stageFocusType,
      todaysNotifications: [],
      todaysLosses: 0,
      todaysPurchases: {},
      todaysRevenue: 0,
      todaysStartingInventory: {},
      toolLevels: {
        [toolType.AXE as toolType]: toolLevel.UNAVAILABLE as toolLevel,
        [toolType.HOE as toolType]: toolLevel.DEFAULT as toolLevel,
        [toolType.PICKER_POLE as toolType]: toolLevel.UNAVAILABLE as toolLevel,
        [toolType.SCYTHE as toolType]: toolLevel.DEFAULT as toolLevel,
        [toolType.SHOVEL as toolType]: toolLevel.UNAVAILABLE as toolLevel,
        [toolType.WATERING_CAN as toolType]: toolLevel.DEFAULT as toolLevel,
      } as Record<toolType, toolLevel>,
      useAlternateEndDayButtonPosition: false,
      valueAdjustments: {},
      version: import.meta.env?.VITE_FARMHAND_PACKAGE_VERSION ?? '',
    }
  }, [path, props.match?.params?.room])

  const [state, setState] = useState<farmhand.state>(createInitialState)
  const stateRef = useRef<farmhand.state>(state)

  stateRef.current = state

  // Falls back to the current room in state when the URL doesn't specify one,
  // mirroring the legacy class's componentDidUpdate default of
  // `params: { room: newRoom = room } = this.props.match`.
  const newRoom = paramRoom !== undefined ? paramRoom : state.room

  const nextDayStateRef = useRef<NextDayStateRecord | null>(null)
  const hasStartedBootRef = useRef(false)

  const boundReducers = useFarmhandReducers(setState)
  const boundReducersRef = useRef(boundReducers)

  boundReducersRef.current = boundReducers

  const prevState = usePrevious(state)

  const viewTitle =
    STAGE_TITLE_MAP[state.stageFocus as keyof typeof STAGE_TITLE_MAP]
  const fieldToolInventory = FarmhandService.getFieldToolInventory(
    state.inventory
  )
  const playerInventory = FarmhandService.computePlayerInventory(
    state.inventory,
    state.valueAdjustments
  )
  const plantableCropInventory = FarmhandService.getPlantableCropInventory(
    state.inventory
  )
  const plantableTreeInventory = FarmhandService.getPlantableTreeInventory(
    state.inventory
  )
  const mulchInventory = FarmhandService.getMulchInventory(state.inventory)

  const levelEntitlements = useMemo(
    () => getLevelEntitlements(levelAchieved(state.experience)),
    [state.experience]
  )
  const shopInventory = useMemo(
    () => getAvailableShopInventory(levelEntitlements),
    [levelEntitlements]
  )

  const isForestUnlocked =
    levelEntitlements.stageFocusType[stageFocusType.FOREST]
  const isChatAvailable = state.isOnline && state.room !== DEFAULT_ROOM

  const viewList = useMemo(
    () =>
      getViewList({
        isForestUnlocked,
        purchasedCellar: state.purchasedCellar,
        purchasedCowPen: state.purchasedCowPen,
        showHomeScreen: state.showHomeScreen,
      }),
    [
      state.showHomeScreen,
      isForestUnlocked,
      state.purchasedCowPen,
      state.purchasedCellar,
    ]
  )

  const peerMetadata = useMemo(() => getPeerMetadata(state), [state])

  const isInputBlocked =
    state.isAwaitingNetworkRequest ||
    state.isAwaitingCowTradeRequest ||
    state.isWaitingForDayToCompleteIncrementing

  const instanceProxyRef = useRef<any>(null)

  // Call sub-hooks
  const {
    openDialogView,
    closeDialogView,
    focusNextView,
    focusPreviousView,
  } = useFarmhandNavigation(setState, viewList)

  // Mirrors the current view into the URL hash's `view` query param, using
  // pushState (not replaceState) so each in-app view change is a real,
  // back/forward-navigable browser history entry - otherwise every
  // navigation just overwrites the one entry the page loaded with, and a
  // single "back" press takes the player out of the app entirely. The
  // `tab` param (a tabbed screen's active tab, see useTabQueryParam) is
  // left alone on the very first run (so a reload can still restore it),
  // but cleared on every subsequent view change, since it belongs to
  // whichever screen was just left.
  const isInitialStageFocusSyncRef = useRef(true)
  // Set by the popstate handler below immediately before it updates
  // stageFocus, so this effect's next run corrects/confirms the hash in
  // place (replace) instead of pushing a new entry for a change that was
  // itself a back/forward navigation.
  const isPopstateStageFocusSyncRef = useRef(false)

  useEffect(() => {
    // Boot (see the effect below) is responsible for the URL's initial
    // `view` value: it validates it against what's actually unlocked
    // before applying it. Mirroring state.stageFocus here before that
    // finishes would immediately overwrite an as-yet-unread bookmarked/
    // shared URL with the pre-boot default.
    if (!state.hasBooted) return

    if (isPopstateStageFocusSyncRef.current) {
      isPopstateStageFocusSyncRef.current = false
      setHashQueryParam(VIEW_QUERY_PARAM_NAME, state.stageFocus)
      return
    }

    if (isInitialStageFocusSyncRef.current) {
      isInitialStageFocusSyncRef.current = false
      setHashQueryParam(VIEW_QUERY_PARAM_NAME, state.stageFocus)
      return
    }

    setHashQueryParam(VIEW_QUERY_PARAM_NAME, state.stageFocus, 'push')
    removeHashQueryParam('tab')
  }, [state.stageFocus, state.hasBooted])

  // Reacts to the browser's back/forward buttons, since pushState above
  // now creates real history entries to navigate between. Re-validates
  // the target view against current unlocks (the same guard boot uses)
  // rather than trusting the history entry outright, since it could be
  // stale relative to what's since become unlocked - or not - in this
  // save.
  useEffect(() => {
    const handlePopState = () => {
      const validatedStageFocus =
        getValidatedStageFocusFromHash(stateRef.current) ?? stageFocusType.HOME

      if (validatedStageFocus === stateRef.current.stageFocus) return

      isPopstateStageFocusSyncRef.current = true
      setState(previous => ({ ...previous, stageFocus: validatedStageFocus }))
    }

    window.addEventListener('popstate', handlePopState)

    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const {
    syncToRoom,
    scheduleHeartbeat,
    tradeForPeerCow,
    handleCowTradeTimeout,
    messagePeers,
  } = useFarmhandNetwork(
    state,
    setState,
    boundReducersRef,
    instanceProxyRef,
    prevState,
    newRoom,
    path,
    peerMetadata
  )

  const {
    clearPersistedData,
    persistState,
    updateServerForNextDay,
    incrementDay,
  } = useFarmhandDayAdvancement(
    stateRef,
    setState,
    props,
    boundReducersRef,
    nextDayStateRef
  )

  const {
    showInventoryFullNotifications,
    showRecipeLearnedNotifications,
  } = useFarmhandNotifications(state, boundReducersRef)

  // Instance proxy to mimic the legacy class "this" so ui-events.tsx can run unmodified
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const instanceProxy = useMemo(
    () => ({
      state,
      props,
      viewTitle,
      fieldToolInventory,
      mulchInventory,
      playerInventory,
      plantableCropInventory,
      plantableTreeInventory,
      viewList,
      levelEntitlements,
      shopInventory,
      peerMetadata,
      isInputBlocked,
      isChatAvailable,
      isForestUnlocked,
      setState: (updater: any, callback?: () => void) => {
        setState(previous => {
          const next =
            typeof updater === 'function' ? updater(previous) : updater

          if (next === null || next === undefined) return previous

          const newState = { ...previous, ...next }

          if (callback) setTimeout(callback, 0)

          return newState
        })
      },
      ...boundReducersRef.current,
      purchaseItem: (item: any, quantity: number) =>
        boundReducersRef.current.purchaseItem(item, quantity),
      sellItem: (item: any, quantity: number) =>
        boundReducersRef.current.sellItem(item, quantity),
      showNotification: (msg: string, sev?: string, onClick?: () => void) =>
        boundReducersRef.current.showNotification(msg, sev, onClick),
      prependPendingPeerMessage: (msg: string, sev?: string) =>
        boundReducersRef.current.prependPendingPeerMessage(msg, sev),
      forRange: (
        fn: any,
        limit: number,
        arg1: number,
        arg2: number,
        arg3?: any
      ) => boundReducersRef.current.forRange(fn, limit, arg1, arg2, arg3),
      createInitialState,
      getData,
      postData,
      tradeForPeerCow,
      handleCowTradeTimeout,
      clearPersistedData,
      syncToRoom,
      scheduleHeartbeat,
      showInventoryFullNotifications,
      showRecipeLearnedNotifications,
      persistState: (overrides = {}) =>
        persistState(instanceProxyRef.current?.state ?? state, overrides),
      updateServerForNextDay,
      incrementDay,
      openDialogView,
      closeDialogView,
      focusNextView,
      focusPreviousView,
      messagePeers,
    }),
    [
      state,
      props,
      viewTitle,
      fieldToolInventory,
      mulchInventory,
      playerInventory,
      plantableCropInventory,
      plantableTreeInventory,
      viewList,
      levelEntitlements,
      shopInventory,
      peerMetadata,
      isInputBlocked,
      isChatAvailable,
      isForestUnlocked,
      tradeForPeerCow,
      handleCowTradeTimeout,
      clearPersistedData,
      syncToRoom,
      scheduleHeartbeat,
      showInventoryFullNotifications,
      showRecipeLearnedNotifications,
      persistState,
      updateServerForNextDay,
      incrementDay,
      openDialogView,
      closeDialogView,
      focusNextView,
      focusPreviousView,
      messagePeers,
      createInitialState,
    ]
  )

  instanceProxyRef.current = instanceProxy

  const handlers = useMemo(() => {
    const bound: any = { debounced: {} }

    Object.keys(eventHandlers).forEach(methodStr => {
      const method = methodStr as keyof typeof eventHandlers

      bound[method] = (...args: any[]) =>
        (eventHandlers[method] as any).apply(instanceProxyRef.current, args)
      bound.debounced[method] = debounce(bound[method], 50)
    })

    return bound as BoundHandlers<typeof eventHandlers> & {
      debounced: BoundHandlers<typeof eventHandlers>
    }
  }, [])

  const keyMap = useMemo(() => {
    const map: Record<string, string> = {
      incrementDay: 'shift+c',
      nextView: 'right',
      openAccounting: 'b',
      openAchievements: 'a',
      openLog: 'l',
      openPriceEvents: 'e',
      openStats: 's',
      openSettings: ',',
      openKeybindings: 'shift+?',
      previousView: 'left',
      toggleMenu: 'm',
    }

    nullArray(9).forEach((_: null, i: number) => {
      map[`numberKey${i + 1}`] = String(i + 1)
    })

    if (import.meta.env?.MODE === 'development') {
      Object.assign(map, { clearPersistedData: 'shift+d', waterAllPlots: 'w' })
    }

    return map
  }, [])

  const keyHandlers = useMemo(() => {
    const map: Record<string, () => void> = {
      incrementDay: () => incrementDay(),
      nextView: focusNextView,
      openAccounting: () => openDialogView(dialogView.ACCOUNTING),
      openAchievements: () => openDialogView(dialogView.ACHIEVEMENTS),
      openLog: () => openDialogView(dialogView.FARMERS_LOG),
      openPriceEvents: () => openDialogView(dialogView.PRICE_EVENTS),
      openStats: () => openDialogView(dialogView.STATS),
      openSettings: () => openDialogView(dialogView.SETTINGS),
      openKeybindings: () => openDialogView(dialogView.KEYBINDINGS),
      previousView: focusPreviousView,
      selectHoe: () => handlers.handleFieldModeSelect(CLEANUP),
      selectScythe: () => handlers.handleFieldModeSelect(HARVEST),
      selectWateringCan: () => handlers.handleFieldModeSelect(WATER),
      selectShovel: () => {
        if (state.toolLevels[toolType.SHOVEL] !== toolLevel.UNAVAILABLE) {
          handlers.handleFieldModeSelect(MINE)
        }
      },
      toggleMenu: () => handlers.handleMenuToggle(),
    }

    nullArray(9).forEach((_: null, i: number) => {
      map[`numberKey${i + 1}`] = () => {
        const viewName = viewList[i]

        if (typeof viewName === 'string') {
          setState(previous => ({
            ...previous,
            stageFocus: stageFocusType[viewName as keyof typeof stageFocusType],
          }))
        }
      }
    })

    if (import.meta.env?.MODE === 'development') {
      Object.assign(map, {
        clearPersistedData: () => clearPersistedData(),
        waterAllPlots: () => boundReducersRef.current.waterAllPlots(),
      })
    }

    return map
  }, [
    incrementDay,
    focusNextView,
    openDialogView,
    focusPreviousView,
    handlers,
    state.toolLevels,
    viewList,
    clearPersistedData,
  ])

  useEffect(() => {
    if (hasStartedBootRef.current) return

    hasStartedBootRef.current = true

    Object.defineProperty(window, 'farmhand', {
      get: () => instanceProxyRef.current,
      configurable: true,
    })

    let isMounted = true

    void (async () => {
      const persistedState = await props.localforage?.getItem('state')

      if (!isMounted) return

      if (persistedState) {
        const sanitizedState = transformStateDataForImport({
          ...createInitialState(),
          ...persistedState,
        })
        const { isCombineEnabled, newDayNotifications } = sanitizedState
        const restoredStageFocus = getValidatedStageFocusFromHash(
          sanitizedState
        )

        setState(previous => ({
          ...previous,
          ...sanitizedState,
          ...(restoredStageFocus && { stageFocus: restoredStageFocus }),
          newDayNotifications: [],
          hasBooted: true,
        }))

        newDayNotifications.forEach(
          ({ message, severity }: farmhand.notification) => {
            setTimeout(
              () =>
                boundReducersRef.current.showNotification(message, severity),
              0
            )
          }
        )

        // NOTE: Intentional behavior change from the legacy class component:
        // this used to run once per queued newDayNotifications entry (and
        // not at all when there were none). It now runs unconditionally,
        // exactly once, whenever isCombineEnabled is true on boot.
        if (isCombineEnabled) {
          boundReducersRef.current.forRange(
            reducers.harvestPlot,
            Infinity,
            0,
            0
          )
        }
      } else {
        await incrementDay(true)

        setState(previous => ({ ...previous, historicalValueAdjustments: [] }))

        boundReducersRef.current.showNotification(
          LOAN_INCREASED('', STANDARD_LOAN_AMOUNT),
          'info'
        )

        // Reads the unlock-relevant fields off the current (fresh-game)
        // state rather than calling createInitialState() again - that
        // would re-run generateCow()/uuid(), consuming extra draws from
        // the seeded RNG sequence that other code (and e2e fixtures tied
        // to specific seeds) depends on staying stable.
        const restoredStageFocus = getValidatedStageFocusFromHash(
          stateRef.current
        )

        setState(prev => ({
          ...prev,
          ...(restoredStageFocus && { stageFocus: restoredStageFocus }),
          hasBooted: true,
        }))
      }

      syncToRoom()
    })()

    return () => {
      isMounted = false
    }
  }, [createInitialState, incrementDay, props.localforage, syncToRoom])

  // isMenuOpen is otherwise only synced to the viewport at boot and on
  // stageFocus changes - without this, resizing the window (or rotating a
  // device) never opens/closes the sidebar until the next of those, which
  // in practice meant a full page reload.
  const previousWindowWidthRef = useRef(window.innerWidth)

  useEffect(() => {
    const handleResize = () => {
      const { innerWidth } = window
      const hasWidthChanged = innerWidth !== previousWindowWidthRef.current

      previousWindowWidthRef.current = innerWidth

      // doesMenuObstructStage is width-based, so a resize that only changed
      // height (e.g. a mobile on-screen keyboard opening/closing) has nothing
      // to update here. Without this guard, that kind of resize closes the
      // sidebar out from under the player mid-typing.
      if (!hasWidthChanged) return

      setState(previous => {
        const isMenuOpen = !doesMenuObstructStage()

        return previous.isMenuOpen === isMenuOpen
          ? previous
          : { ...previous, isMenuOpen }
      })
    }

    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Post-increment day side effects
  useEffect(() => {
    if (!state.hasBooted || !nextDayStateRef.current) return

    let isMounted = true

    const {
      state: resolvedNextDayState,
      pendingNotifications,
      broadcastedPositionMessage,
      isFirstDay,
    } = nextDayStateRef.current

    nextDayStateRef.current = null

    void (async () => {
      try {
        await props.localforage?.setItem(
          'state',
          reduceByPersistedKeys({
            ...resolvedNextDayState,
            ...(isFirstDay && { historicalValueAdjustments: [] }),
            newDayNotifications: pendingNotifications,
          })
        )

        if (!isMounted) return

        const notifications = [...pendingNotifications]

        notifications
          .concat(
            isFirstDay
              ? []
              : [{ message: PROGRESS_SAVED_MESSAGE, severity: 'info' }]
          )
          .forEach(({ message, severity }) =>
            boundReducersRef.current.showNotification(message, severity)
          )

        if (resolvedNextDayState.isCombineEnabled) {
          if (resolvedNextDayState.stageFocus === stageFocusType.FIELD) {
            await sleep(1000)
          }

          if (!isMounted) return

          boundReducersRef.current.forRange(
            reducers.harvestPlot,
            Infinity,
            0,
            0
          )
        }
      } catch (e) {
        console.error(e)
        if (isMounted) {
          boundReducersRef.current.showNotification(JSON.stringify(e), 'error')
        }
      } finally {
        if (isMounted) {
          setState(previous => ({
            ...previous,
            isWaitingForDayToCompleteIncrementing: false,
          }))

          if (broadcastedPositionMessage) {
            boundReducersRef.current.prependPendingPeerMessage(
              broadcastedPositionMessage
            )
          }
        }
      }
    })()

    return () => {
      isMounted = false
    }
  }, [state.dayCount, state.hasBooted, props.localforage, setState])

  // Cleanup on unmount. Uses stateRef (rather than depending on
  // state.heartbeatTimeoutId/state.peerRoom directly) so this only runs once,
  // on unmount — depending on those values re-fires this cleanup on every
  // heartbeat tick, which leaves the peer room every ~10s while online.
  useEffect(() => {
    return () => {
      if (stateRef.current.heartbeatTimeoutId) {
        clearTimeout(stateRef.current.heartbeatTimeoutId)
      }

      stateRef.current.peerRoom?.leave()
    }
  }, [])

  // ComponentDidUpdate for non-network effects (achievements, cow selection, menu menu, money)
  useEffect(() => {
    if (!state.hasBooted || !prevState) return

    const updatedAchievementsState = reducers.updateAchievements(
      state,
      prevState
    )

    if (updatedAchievementsState !== state) {
      setState(previous => {
        const next = reducers.updateAchievements(previous, prevState)

        return next !== previous ? next : previous
      })
    }

    if (
      state.stageFocus === stageFocusType.COW_PEN &&
      prevState.stageFocus !== stageFocusType.COW_PEN
    ) {
      setState(previous => ({ ...previous, selectedCowId: '' }))
    }

    if (state.stageFocus !== prevState.stageFocus && state.isMenuOpen) {
      setState(previous => {
        const isMenuOpen = !doesMenuObstructStage()

        return previous.isMenuOpen === isMenuOpen
          ? previous
          : { ...previous, isMenuOpen }
      })
    }

    if (state.money < prevState.money) {
      setState(previous => ({
        ...previous,
        todaysLosses: moneyTotal(
          previous.todaysLosses,
          state.money - prevState.money
        ),
      }))
    }

    showInventoryFullNotifications(prevState, state)
    showRecipeLearnedNotifications(prevState)
  }, [
    state,
    prevState,
    showInventoryFullNotifications,
    showRecipeLearnedNotifications,
  ])

  const redirect = state.redirect
  const gameState = {
    ...state,
    blockInput: isInputBlocked,
    features: propsFeatures ?? {},
    fieldToolInventory,
    mulchInventory,
    isChatAvailable,
    levelEntitlements,
    plantableCropInventory,
    plantableTreeInventory,
    playerInventory,
    playerInventoryQuantities: getInventoryQuantities(state.inventory),
    shopInventory,
    viewList,
    viewTitle,
  }

  return {
    gameState,
    handlers,
    isInputBlocked,
    keyMap,
    keyHandlers,
    redirect,
    state,
    viewList,
    focusPreviousView,
    focusNextView,
    isChatAvailable,
  }
}
