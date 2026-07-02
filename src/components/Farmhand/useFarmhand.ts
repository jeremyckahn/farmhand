import { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import { joinRoom } from '@trystero-p2p/torrent'
import window from 'global/window.js'
import debounce from 'lodash.debounce'
import throttle from 'lodash.throttle'
import { v4 as uuid } from 'uuid'

import * as reducers from '../../game-logic/reducers/index.js'
import {
  handleCowTradeRequest,
  handleCowTradeRequestAccept,
  handleCowTradeRequestReject,
  handlePeerMetadataRequest,
} from '../../handlers/peer-events.js'
import eventHandlers from '../../handlers/ui-events.js'

import { endpoints, features, relayUrls, rtcConfig } from '../../config.js'
import {
  COW_TRADE_TIMEOUT,
  DEFAULT_ROOM,
  HEARTBEAT_INTERVAL_PERIOD,
  INITIAL_STORAGE_LIMIT,
  STAGE_TITLE_MAP,
  STANDARD_LOAN_AMOUNT,
  STANDARD_VIEW_LIST,
} from '../../constants.js'
import { scarecrow } from '../../data/items.js'
import { recipesMap } from '../../data/maps.js'
import {
  dialogView,
  fieldMode,
  stageFocusType,
  toolLevel,
  toolType,
} from '../../enums.js'
import { getData, postData } from '../../fetch-utils.js'
import {
  CONNECTING_TO_SERVER,
  COW_ALREADY_OWNED,
  DATA_DELETED,
  DISCONNECTED_FROM_SERVER,
  INVENTORY_FULL_NOTIFICATION,
  PROGRESS_SAVED_MESSAGE,
  REQUESTED_COW_TRADE_UNAVAILABLE,
  SERVER_ERROR,
} from '../../strings.js'
import {
  CONNECTED_TO_ROOM,
  LOAN_INCREASED,
  POSITIONS_POSTED_NOTIFICATION,
  RECIPE_LEARNED,
  RECIPES_LEARNED,
} from '../../templates.js'
import { getLevelEntitlements } from '../../utils/getLevelEntitlements.js'
import { computeMarketPositions } from '../../utils/computeMarketPositions.js'
import { createNewField } from '../../utils/createNewField.js'
import { createNewForest } from '../../utils/createNewForest.js'
import { doesMenuObstructStage } from '../../utils/doesMenuObstructStage.js'
import { generateCow } from '../../utils/generateCow.js'
import { getAvailableShopInventory } from '../../utils/getAvailableShopInventory.js'
import { getPeerMetadata } from '../../utils/getPeerMetadata.js'
import { inventorySpaceRemaining } from '../../utils/inventorySpaceRemaining.js'
import { moneyTotal } from '../../utils/moneyTotal.js'
import { nullArray } from '../../utils/nullArray.js'
import { reduceByPersistedKeys } from '../../utils/reduceByPersistedKeys.js'
import { sleep } from '../../utils/sleep.js'
import { transformStateDataForImport } from '../../utils/transformStateDataForImport.js'
import { levelAchieved } from '../../utils/levelAchieved.js'
import { noop } from '../../utils/noop.js'

import { BoundHandlers } from './Farmhand.context.js'
import { FarmhandProps } from './FarmhandReducers.js'
import { getInventoryQuantities } from './helpers/getInventoryQuantities.js'
import { FarmhandService } from './FarmhandService.js'

import { useFarmhandReducers } from './useFarmhandReducers.js'
import { usePrevious } from './usePrevious.js'

const { CLEANUP, HARVEST, MINE, WATER, PLANT } = fieldMode

export function useFarmhand(props: FarmhandProps) {
  // Extract props properly
  const {
    features: propsFeatures,
    match: {
      path = '',
      params: {
        room: newRoom = decodeURIComponent(
          props.match?.params?.room || DEFAULT_ROOM
        ),
      } = {},
    } = {},
  } = props

  const createInitialState = useCallback((): farmhand.state => {
    return {
      activePlayers: null,
      allowCustomPeerCowNames: false,
      cellarInventory: [],
      currentDialogView: dialogView.NONE as farmhand.dialogView,
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
      fieldMode: fieldMode.OBSERVE as farmhand.fieldMode,
      forest: createNewForest(),
      getCowAccept: noop,
      getCowReject: noop,
      getCowTradeRequest: noop,
      getPeerMetadata: noop,
      hasBooted: false,
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
      selectedItemId: '',
      priceCrashes: {},
      priceSurges: {},
      profitabilityStreak: 0,
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
      sendCowTradeRequest: noop,
      showHomeScreen: true,
      showNotifications: true,
      stageFocus: stageFocusType.HOME as farmhand.stageFocusType,
      todaysNotifications: [],
      todaysLosses: 0,
      todaysPurchases: {},
      todaysRevenue: 0,
      todaysStartingInventory: {},
      toolLevels: {
        [toolType.HOE as farmhand.toolType]: toolLevel.DEFAULT as farmhand.toolLevel,
        [toolType.SCYTHE as farmhand.toolType]: toolLevel.DEFAULT as farmhand.toolLevel,
        [toolType.SHOVEL as farmhand.toolType]: toolLevel.UNAVAILABLE as farmhand.toolLevel,
        [toolType.WATERING_CAN as farmhand.toolType]: toolLevel.DEFAULT as farmhand.toolLevel,
      } as Record<farmhand.toolType, farmhand.toolLevel>,
      useAlternateEndDayButtonPosition: false,
      valueAdjustments: {},
      version: import.meta.env?.VITE_FARMHAND_PACKAGE_VERSION ?? '',
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const [state, setState] = useState<farmhand.state>(createInitialState)

  const boundReducers = useFarmhandReducers(state, setState)
  const boundReducersRef = useRef<any>(boundReducers)

  boundReducersRef.current = boundReducers as any

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

  const viewList = useMemo(() => {
    const { CELLAR, COW_PEN, HOME, WORKSHOP, FOREST } = stageFocusType
    const list: farmhand.stageFocusType[] = [
      ...STANDARD_VIEW_LIST,
    ] as farmhand.stageFocusType[]

    if (state.showHomeScreen) {
      list.unshift(HOME as farmhand.stageFocusType)
    }
    if (isForestUnlocked && features.FOREST) {
      list.push(FOREST as farmhand.stageFocusType)
    }
    if (state.purchasedCowPen) {
      list.push(COW_PEN)
    }
    list.push(WORKSHOP)
    if (state.purchasedCellar) {
      list.push(CELLAR)
    }
    return list
  }, [
    state.showHomeScreen,
    isForestUnlocked,
    state.purchasedCowPen,
    state.purchasedCellar,
  ])

  const peerMetadata = useMemo(() => getPeerMetadata(state), [state])

  const isInputBlocked =
    state.isAwaitingNetworkRequest ||
    state.isAwaitingCowTradeRequest ||
    state.isWaitingForDayToCompleteIncrementing

  const wrapSendPeerMetadata = useCallback((sendPeerMetadata: Function) => {
    return throttle(
      (...args: any[]) => {
        sendPeerMetadata(...args)
        setState(s => ({ ...s, pendingPeerMessages: [] }))
      },
      5000,
      { trailing: true }
    )
  }, [])

  const handleCowTradeTimeout = useCallback(() => {
    setState(s => {
      if (typeof s.cowTradeTimeoutId === 'number') {
        setTimeout(
          () =>
            boundReducersRef.current.showNotification(
              REQUESTED_COW_TRADE_UNAVAILABLE,
              'error'
            ),
          0
        )
        console.error('Cow trade request timed out')
        return {
          ...s,
          cowTradeTimeoutId: null,
          isAwaitingCowTradeRequest: false,
        }
      }
      return s
    })
  }, [])

  const tradeForPeerCow = useCallback(
    (peerPlayerCow: farmhand.cow) => {
      setState((s: farmhand.state) => {
        const {
          cowIdOfferedForTrade,
          cowInventory,
          peers,
          sendCowTradeRequest,
        } = s

        if (!sendCowTradeRequest) return s

        const { ownerId } = peerPlayerCow
        const [peerId] =
          Object.entries(peers).find(
            ([, peer]: [string, any]) => peer?.playerId === ownerId
          ) ?? []

        if (!peerId) {
          console.error(
            `Owner not found for cow ${JSON.stringify(peerPlayerCow)}`
          )
          return s
        }

        const playerAlreadyOwnsRequestedCow = cowInventory.find(
          ({ id }: farmhand.cow) => id === peerPlayerCow.id
        )

        if (playerAlreadyOwnsRequestedCow) {
          console.error(`Cow ID ${peerPlayerCow.id} is already in inventory`)
          setTimeout(
            () =>
              boundReducersRef.current.showNotification(
                COW_ALREADY_OWNED,
                'error'
              ),
            0
          )
          return s
        }

        const cowToTradeAway = cowInventory.find(
          ({ id }: farmhand.cow) => id === cowIdOfferedForTrade
        )

        if (!cowToTradeAway) {
          console.error(`Cow ID ${cowIdOfferedForTrade} not found`)
          return s
        }

        const cowTradeTimeoutId = setTimeout(
          handleCowTradeTimeout,
          COW_TRADE_TIMEOUT
        )

        sendCowTradeRequest(
          {
            cowOffered: { ...cowToTradeAway, isUsingHuggingMachine: false },
            cowRequested: peerPlayerCow,
          },
          peerId
        )

        return {
          ...s,
          cowTradeTimeoutId: (cowTradeTimeoutId as unknown) as number,
          isAwaitingCowTradeRequest: true,
        }
      })
    },
    [handleCowTradeTimeout]
  )

  const clearPersistedData = useCallback(async () => {
    await props.localforage?.clear()
    boundReducersRef.current.showNotification(DATA_DELETED)
  }, [props.localforage])

  const scheduleHeartbeat = useCallback(() => {
    setState(s => {
      clearTimeout(s.heartbeatTimeoutId ?? -1)
      const heartbeatTimeoutId = (window.setTimeout(() => {
        setState((s2: farmhand.state) => ({
          ...s2,
          money: moneyTotal(s2.money, s2.activePlayers ?? 0),
        }))
        scheduleHeartbeat()
      }, HEARTBEAT_INTERVAL_PERIOD) as unknown) as number

      return { ...s, heartbeatTimeoutId }
    })
  }, [])

  const syncToRoom = useCallback(async () => {
    const { isOnline, priceCrashes, priceSurges, room } = state

    if (!isOnline) return

    boundReducersRef.current.showNotification(CONNECTING_TO_SERVER, 'info')

    try {
      setState(s => ({ ...s, isAwaitingNetworkRequest: true, peers: {} }))
      state.peerRoom?.leave()

      const { valueAdjustments } = await getData(endpoints.getMarketData, {
        farmId: state.playerId,
        room,
      })

      scheduleHeartbeat()

      const relayRedundancy = 4

      setState(s => ({
        ...s,
        activePlayers: 1,
        peerRoom: joinRoom(
          {
            appId: import.meta.env?.VITE_NAME,
            rtcConfig,
            ...(relayUrls && {
              relayConfig: { urls: relayUrls, redundancy: relayRedundancy },
            }),
          },
          room
        ),
        valueAdjustments: FarmhandService.applyPriceEvents(
          valueAdjustments,
          priceCrashes,
          priceSurges
        ),
      }))

      boundReducersRef.current.showNotification(
        CONNECTED_TO_ROOM('', room),
        'success'
      )
      console.log('SYNC TO ROOM SUCCESS')
    } catch (e) {
      boundReducersRef.current.showNotification(SERVER_ERROR, 'error')
      console.log('SYNC TO ROOM ERROR', e, 'STATE:', state)
      console.error(e)
      setState(s => ({ ...s, redirect: '/', cowIdOfferedForTrade: '' }))
    }

    setState(s => ({
      ...s,
      isAwaitingNetworkRequest: false,
      isAwaitingCowTradeRequest: false,
    }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.isOnline, state.room, scheduleHeartbeat])

  const initializeNewGame = useCallback(async () => {
    // Note: incrementDay logic comes later, but we need to call it here.
    // For now, we stub it until we define it
  }, [])

  const showInventoryFullNotifications = useCallback(
    (prev: farmhand.state, currentState: farmhand.state) => {
      if (
        inventorySpaceRemaining(prev) > 0 &&
        inventorySpaceRemaining(currentState) <= 0
      ) {
        boundReducersRef.current.showNotification(
          INVENTORY_FULL_NOTIFICATION,
          'warning'
        )
      }
    },
    []
  )

  const showRecipeLearnedNotifications = useCallback(
    ({ learnedRecipes: previousLearnedRecipes }: farmhand.state) => {
      let learnedRecipes: farmhand.recipe[] = []

      Object.keys(state.learnedRecipes).forEach(recipeId => {
        if (!previousLearnedRecipes.hasOwnProperty(recipeId)) {
          learnedRecipes.push(recipesMap[recipeId])
        }
      })

      if (learnedRecipes.length > 1) {
        boundReducersRef.current.showNotification(
          RECIPES_LEARNED('', learnedRecipes)
        )
      } else if (learnedRecipes.length === 1) {
        boundReducersRef.current.showNotification(
          RECIPE_LEARNED('', learnedRecipes[0])
        )
      }
    },
    [state.learnedRecipes]
  )

  const persistState = useCallback(
    (currentState: farmhand.state, overrides = {}) => {
      return props.localforage?.setItem(
        'state',
        reduceByPersistedKeys({ ...currentState, ...overrides })
      )
    },
    [props.localforage]
  )

  const updateServerForNextDay = useCallback(async () => {
    const serverMessages: farmhand.notification[] = []
    let broadcastedPositionMessage: string | null = null

    setState(s => ({ ...s, isAwaitingNetworkRequest: true }))

    let serverValueAdjustments: Record<string, number> | undefined

    if (state.isOnline) {
      const {
        inventory,
        room,
        todaysPurchases,
        todaysStartingInventory,
      } = state
      const positions = computeMarketPositions(
        todaysStartingInventory,
        todaysPurchases,
        inventory
      )

      try {
        serverValueAdjustments = (
          await postData(endpoints.postDayResults, { positions, room })
        ).valueAdjustments
        if (Object.keys(positions).length) {
          serverMessages.push({
            message: POSITIONS_POSTED_NOTIFICATION('', 'You', positions),
            severity: 'info',
          })
          broadcastedPositionMessage = POSITIONS_POSTED_NOTIFICATION(
            '',
            '',
            positions
          )
        }
      } catch (e) {
        serverMessages.push({ message: SERVER_ERROR, severity: 'error' })
        setState(s => ({
          ...s,
          redirect: '/',
          cowIdOfferedForTrade: '',
          isAwaitingNetworkRequest: false,
        }))
        console.error(e)
      }
    }
    return {
      broadcastedPositionMessage,
      serverMessages,
      serverValueAdjustments,
    }
  }, [state])

  const incrementDay = useCallback(
    async (isFirstDay = false) => {
      let shouldBlock = false

      setState(prev => {
        if (prev.isWaitingForDayToCompleteIncrementing && !isFirstDay) {
          shouldBlock = true
        }
        return prev
      })

      if (shouldBlock) return

      if (!isFirstDay) {
        setState(prev => ({
          ...prev,
          isWaitingForDayToCompleteIncrementing: true,
        }))
      }

      // Wait until network operations are done.
      const {
        broadcastedPositionMessage,
        serverMessages,
        serverValueAdjustments,
      } = await updateServerForNextDay()

      // Using functional updater to ensure we always compute based on the absolute latest state
      let resolvedNextDayState: any = null
      let pendingNotifications: any = []

      setState(prev => {
        const nextDayState = reducers.computeStateForNextDay(prev, isFirstDay)

        pendingNotifications = [
          ...serverMessages,
          ...nextDayState.newDayNotifications,
        ]
        nextDayState.valueAdjustments = FarmhandService.applyPriceEvents(
          serverValueAdjustments ?? nextDayState.valueAdjustments,
          nextDayState.priceCrashes,
          nextDayState.priceSurges
        )
        nextDayState.isAwaitingNetworkRequest = false
        nextDayState.isWaitingForDayToCompleteIncrementing = false // UNLOCK UI IMMEDIATELY
        nextDayState.newDayNotifications = []
        nextDayState.todaysNotifications = []

        resolvedNextDayState = nextDayState
        return nextDayState
      })

      // We defer the async stuff until the state update is queued
      setTimeout(async () => {
        try {
          if (resolvedNextDayState) {
            console.log('INCREMENT DAY SUCCESS', resolvedNextDayState.day)
            await props.localforage?.setItem(
              'state',
              reduceByPersistedKeys({
                ...resolvedNextDayState,
                newDayNotifications: pendingNotifications,
              })
            )

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
              boundReducersRef.current.forRange(
                reducers.harvestPlot,
                Infinity,
                0,
                0
              )
            }
          }
        } catch (e) {
          console.error(e)
          boundReducersRef.current.showNotification(JSON.stringify(e), 'error')
        } finally {
          if (broadcastedPositionMessage) {
            boundReducersRef.current.prependPendingPeerMessage(
              broadcastedPositionMessage
            )
          }
        }
      }, 0)
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [updateServerForNextDay, props.localforage]
  )

  const openDialogView = useCallback((dialogViewName: farmhand.dialogView) => {
    setState(s => ({
      ...s,
      currentDialogView: dialogViewName,
      isDialogViewOpen: true,
    }))
  }, [])

  const closeDialogView = useCallback(() => {
    setState(s => ({ ...s, isDialogViewOpen: false }))
  }, [])

  const focusNextView = useCallback(() => {
    if (document.activeElement?.getAttribute('role') === 'tab') return
    setState((s: farmhand.state) => {
      const currentViewIndex = viewList.indexOf(s.stageFocus)

      return {
        ...s,
        stageFocus: viewList[(currentViewIndex + 1) % viewList.length],
      }
    })
  }, [viewList])

  const focusPreviousView = useCallback(() => {
    if (document.activeElement?.getAttribute('role') === 'tab') return
    setState((s: farmhand.state) => {
      const currentViewIndex = viewList.indexOf(s.stageFocus)

      return {
        ...s,
        stageFocus:
          viewList[
            currentViewIndex === 0
              ? viewList.length - 1
              : (currentViewIndex - 1) % viewList.length
          ],
      }
    })
  }, [viewList])

  const messagePeers = useCallback((message: string, severity?: string) => {
    boundReducersRef.current.prependPendingPeerMessage(message, severity)
  }, [])

  // Instance proxy to mimic the legacy class "this" so ui-events.tsx can run unmodified
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const instanceProxy = useMemo(
    () => ({
      state,
      props,
      viewTitle,
      fieldToolInventory,
      playerInventory,
      plantableCropInventory,
      viewList,
      levelEntitlements,
      shopInventory,
      peerMetadata,
      isInputBlocked,
      isChatAvailable,
      isForestUnlocked,
      setState: (updater: any, callback?: () => void) => {
        setState(prev => {
          const next = typeof updater === 'function' ? updater(prev) : updater

          if (next === null || next === undefined) return prev
          const newState = { ...prev, ...next }

          if (callback) setTimeout(callback, 0)
          return newState
        })
      },
      ...boundReducersRef.current,
      purchaseItem: (item: any, quantity: number) =>
        boundReducersRef.current.purchaseItem(item, quantity),
      sellItem: (item: any, quantity: number) =>
        boundReducersRef.current.sellItem(item, quantity),
      showNotification: (msg: string, sev?: string) =>
        boundReducersRef.current.showNotification(msg, sev),
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
      initializeNewGame,
      tradeForPeerCow,
      handleCowTradeTimeout,
      clearPersistedData,
      syncToRoom,
      scheduleHeartbeat,
      showInventoryFullNotifications,
      showRecipeLearnedNotifications,
      persistState: (overrides = {}) => persistState(state, overrides),
      updateServerForNextDay,
      incrementDay,
      openDialogView,
      closeDialogView,
      focusNextView,
      focusPreviousView,
      messagePeers,
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }),
    [
      state,
      props,
      viewTitle,
      fieldToolInventory,
      playerInventory,
      plantableCropInventory,
      viewList,
      levelEntitlements,
      shopInventory,
      peerMetadata,
      isInputBlocked,
      isChatAvailable,
      isForestUnlocked,
      initializeNewGame,
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

  const instanceProxyRef = useRef<any>(null)

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
          setState(s => ({
            ...s,
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

  // ComponentDidMount
  useEffect(() => {
    window.farmhand = instanceProxy // Legacy debug hook
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

        setState(s => ({
          ...s,
          ...sanitizedState,
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
            if (isCombineEnabled) {
              boundReducersRef.current.forRange(
                reducers.harvestPlot,
                Infinity,
                0,
                0
              )
            }
          }
        )
      } else {
        await incrementDay(true)
        setState(s => ({ ...s, historicalValueAdjustments: [] }))
        boundReducersRef.current.showNotification(
          LOAN_INCREASED('', STANDARD_LOAN_AMOUNT),
          'info'
        )
        setState(s => ({ ...s, hasBooted: true }))
      }

      syncToRoom()
    })()

    return () => {
      isMounted = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ComponentDidUpdate
  useEffect(() => {
    if (!state.hasBooted || !prevState) return

    const decodedRoom = decodeURIComponent(newRoom)
    const newIsOnline = path.startsWith('/online')

    if (newIsOnline !== state.isOnline || decodedRoom !== state.room) {
      setState(s => ({
        ...s,
        isOnline: newIsOnline,
        redirect: '',
        room: decodedRoom,
      }))
    }

    if (
      state.isOnline !== prevState.isOnline ||
      state.room !== prevState.room
    ) {
      if (newIsOnline) syncToRoom()

      if (!state.isOnline && typeof state.heartbeatTimeoutId === 'number') {
        clearTimeout(state.heartbeatTimeoutId)
        setState(s => ({
          ...s,
          activePlayers: null,
          heartbeatTimeoutId: null,
          peerRoom: null,
        }))
      }
    }

    if (state.isOnline === false && prevState.isOnline === true) {
      boundReducersRef.current.showNotification(
        DISCONNECTED_FROM_SERVER,
        'info'
      )
    }

    const updatedAchievementsState = reducers.updateAchievements(
      state,
      prevState
    )

    if (updatedAchievementsState !== state) {
      setState(() => updatedAchievementsState)
    }

    if (
      state.stageFocus === stageFocusType.COW_PEN &&
      prevState.stageFocus !== stageFocusType.COW_PEN
    ) {
      setState(s => ({ ...s, selectedCowId: '' }))
    }

    if (state.stageFocus !== prevState.stageFocus && state.isMenuOpen) {
      setState(s => ({ ...s, isMenuOpen: !doesMenuObstructStage() }))
    }

    if (state.money < prevState.money) {
      setState(s => ({
        ...s,
        todaysLosses: moneyTotal(s.todaysLosses, state.money - prevState.money),
      }))
    }

    if (state.peerRoom !== prevState.peerRoom) {
      if (state.peerRoom) {
        state.peerRoom.onPeerJoin((id: string) =>
          boundReducersRef.current.addPeer(id)
        )
        state.peerRoom.onPeerLeave((id: string) =>
          boundReducersRef.current.removePeer(id)
        )

        const [
          sendPeerMetadata,
          getPeerMetadataFunc,
        ] = state.peerRoom.makeAction('peerMetadata')

        getPeerMetadataFunc((...args: any[]) =>
          handlePeerMetadataRequest(instanceProxy, args[0], args[1])
        )

        const [
          sendCowTradeRequest,
          getCowTradeRequest,
        ] = state.peerRoom.makeAction('cowTrade')

        getCowTradeRequest((...args: any[]) =>
          handleCowTradeRequest(instanceProxy, args[0], args[1])
        )

        const [sendCowAccept, getCowAccept] = state.peerRoom.makeAction(
          'cowAccept'
        )

        getCowAccept((...args: any[]) =>
          handleCowTradeRequestAccept(instanceProxy, args[0], args[1])
        )

        const [sendCowReject, getCowReject] = state.peerRoom.makeAction(
          'cowReject'
        )

        getCowReject((...args: any[]) =>
          handleCowTradeRequestReject(instanceProxy, args[0])
        )

        setState(s => ({
          ...s,
          getCowAccept,
          getCowReject,
          getCowTradeRequest,
          getPeerMetadata: getPeerMetadataFunc,
          pendingPeerMessages: [],
          sendCowAccept,
          sendCowReject,
          sendCowTradeRequest,
          sendPeerMetadata: wrapSendPeerMetadata(sendPeerMetadata),
        }))

        sendPeerMetadata(peerMetadata)
      } else {
        prevState.peerRoom?.leave()
        setState(s => ({ ...s, peers: {}, sendPeerMetadata: null }))
      }
    }

    showInventoryFullNotifications(prevState, state)
    showRecipeLearnedNotifications(prevState)

    state.sendPeerMetadata?.(peerMetadata)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    state,
    prevState,
    newRoom,
    path,
    syncToRoom,
    instanceProxy,
    wrapSendPeerMetadata,
    peerMetadata,
    showInventoryFullNotifications,
    showRecipeLearnedNotifications,
  ])

  const redirect = state.redirect
  const gameState = {
    ...state,
    blockInput: isInputBlocked,
    features: propsFeatures ?? {},
    fieldToolInventory,
    isChatAvailable,
    levelEntitlements,
    plantableCropInventory,
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
