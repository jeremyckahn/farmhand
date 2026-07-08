import * as React from 'react'
import { render } from '@testing-library/react'

import { COW_TRADE_TIMEOUT } from '../../../constants.js'
import { REQUESTED_COW_TRADE_UNAVAILABLE } from '../../../strings.js'
import { getCowStub } from '../../../test-utils/stubs/cowStub.js'

import { useFarmhandNetwork } from './useFarmhandNetwork.js'

type NetworkHookReturn = ReturnType<typeof useFarmhandNetwork>

// There's no precedent elsewhere in this codebase for exercising a hook in
// isolation (every other shell/hook-adjacent test mounts the full Farmhand
// component via farmhandStub), because doing that here would mean going
// "online" for real and hitting actual WebRTC via trystero. tradeForPeerCow's
// timeout scheduling never touches the network, so this harness renders just
// enough to call useFarmhandNetwork with hand-built fakes and grab its
// returned functions.
function TestHarness({
  state,
  setState,
  boundReducersRef,
  instanceProxyRef,
  onReady,
}: {
  state: farmhand.state
  setState: React.Dispatch<React.SetStateAction<farmhand.state>>
  boundReducersRef: React.MutableRefObject<any>
  instanceProxyRef: React.MutableRefObject<any>
  onReady: (hookReturn: NetworkHookReturn) => void
}) {
  const hookReturn = useFarmhandNetwork(
    state,
    setState,
    boundReducersRef,
    instanceProxyRef,
    undefined,
    '',
    '',
    {} as farmhand.peerMetadata
  )

  onReady(hookReturn)

  return null
}

const setup = () => {
  const peerId = 'peer-1'
  const ownerId = 'owner-1'

  const cowOfferedForTrade = getCowStub({
    id: 'offered-cow-id',
    ownerId: 'my-player-id',
  })
  const peerCow = getCowStub({ id: 'peer-cow-id', ownerId })

  const sendCowTradeRequest = vitest.fn()
  const showNotification = vitest.fn()

  const fakeState = ({
    peers: {
      [peerId]: { playerId: ownerId } as farmhand.peerMetadata,
    },
    sendCowTradeRequest,
    cowInventory: [cowOfferedForTrade],
    cowIdOfferedForTrade: cowOfferedForTrade.id,
  } as unknown) as farmhand.state

  const instanceProxyRef: React.MutableRefObject<any> = {
    current: { state: { ...fakeState } },
  }

  const boundReducersRef: React.MutableRefObject<any> = {
    current: { showNotification },
  }

  const setState = vitest.fn()

  let hookReturn!: NetworkHookReturn

  render(
    React.createElement(TestHarness, {
      state: fakeState,
      setState,
      boundReducersRef,
      instanceProxyRef,
      onReady: (r: NetworkHookReturn) => {
        hookReturn = r
      },
    })
  )

  return {
    peerId,
    ownerId,
    cowOfferedForTrade,
    peerCow,
    sendCowTradeRequest,
    showNotification,
    setState,
    instanceProxyRef,
    fakeState,
    hookReturn,
  }
}

// Regression coverage for a gap left by the class-to-functional refactor of
// Farmhand.tsx: tradeForPeerCow (now in useFarmhandNetwork.ts) schedules a
// plain setTimeout(handleCowTradeTimeout, COW_TRADE_TIMEOUT) so a requester
// isn't stuck forever if a peer never responds to a cow trade request. The
// only existing coverage for this area is the Playwright test in
// e2e/tests/multiplayer/cow-trade-races.test.ts, and its own comment
// explains it deliberately avoids the real 10s timeout (racing it against
// WebRTC teardown was flaky) in favor of an equivalent reject path. That
// leaves the actual timer firing with zero automated coverage. tradeForPeerCow
// never awaits a real peer connection to arm the timer, so it can be driven
// directly here with fake timers instead.
describe('useFarmhandNetwork cow trade timeout', () => {
  afterEach(() => {
    vitest.useRealTimers()
  })

  test('unblocks the requester and shows an error when the peer never responds', () => {
    vitest.useFakeTimers()

    const {
      peerId,
      cowOfferedForTrade,
      peerCow,
      sendCowTradeRequest,
      showNotification,
      setState,
      instanceProxyRef,
      fakeState,
      hookReturn,
    } = setup()

    hookReturn.tradeForPeerCow(peerCow)

    expect(sendCowTradeRequest).toHaveBeenCalledTimes(1)
    expect(sendCowTradeRequest).toHaveBeenCalledWith(
      {
        cowOffered: { ...cowOfferedForTrade, isUsingHuggingMachine: false },
        cowRequested: peerCow,
      },
      peerId
    )

    expect(setState).toHaveBeenCalledTimes(1)
    const scheduledPatch = setState.mock.calls[0][0](fakeState)

    expect(scheduledPatch.isAwaitingCowTradeRequest).toBe(true)
    expect(scheduledPatch.cowTradeTimeoutId).not.toBeNull()

    // handleCowTradeTimeout guards on
    // instanceProxyRef.current.state.cowTradeTimeoutId being a `number`.
    // In a browser, setTimeout's real return value already satisfies that,
    // but under Node (which is what this jsdom-based test runs on) it's a
    // Timeout object instead, so it's coerced the same way a real numeric
    // id would flow through unchanged. This keeps the fake ref in sync with
    // what tradeForPeerCow just scheduled.
    instanceProxyRef.current.state.cowTradeTimeoutId = Number(
      scheduledPatch.cowTradeTimeoutId
    )

    vitest.advanceTimersByTime(COW_TRADE_TIMEOUT)

    expect(showNotification).toHaveBeenCalledWith(
      REQUESTED_COW_TRADE_UNAVAILABLE,
      'error'
    )

    expect(setState).toHaveBeenCalledTimes(2)
    const timeoutPatch = setState.mock.calls[1][0](fakeState)

    expect(timeoutPatch.cowTradeTimeoutId).toBe(null)
    expect(timeoutPatch.isAwaitingCowTradeRequest).toBe(false)
  })

  test('does not fire early, before COW_TRADE_TIMEOUT elapses', () => {
    vitest.useFakeTimers()

    const { peerCow, showNotification, setState, hookReturn } = setup()

    hookReturn.tradeForPeerCow(peerCow)

    expect(setState).toHaveBeenCalledTimes(1)

    vitest.advanceTimersByTime(COW_TRADE_TIMEOUT - 1)

    expect(showNotification).not.toHaveBeenCalled()
    expect(setState).toHaveBeenCalledTimes(1)
  })
})
