import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { MatchState } from '@jeremyckahn/farmhand-shuffle'

import FarmhandContext, {
  createContextData,
} from '../Farmhand/Farmhand.context.js'
import { testState } from '../../test-utils/index.js'

import { FarmhandShuffleView } from './FarmhandShuffleView.js'

const matchPropsRef: { current: any } = { current: null }

vi.mock('@jeremyckahn/farmhand-shuffle', () => ({
  Match: (props: any) => {
    matchPropsRef.current = props
    return <div data-testid="match">Match</div>
  },
  MatchState: {
    WAITING_FOR_PLAYER_SETUP_ACTION: 'WAITING_FOR_PLAYER_SETUP_ACTION',
    WAITING_FOR_PLAYER_TURN_ACTION: 'WAITING_FOR_PLAYER_TURN_ACTION',
    GAME_OVER: 'GAME_OVER',
    UNINITIALIZED: 'UNINITIALIZED',
  },
  starterDeck: () => [],
  serializeMatch: (match: any) => match,
  deserializeMatch: (data: any) => data,
}))

vi.mock('@jeremyckahn/farmhand-shuffle/package.json', () => ({
  default: { version: '0.0.1' },
  version: '0.0.1',
}))

describe('<FarmhandShuffleView />', () => {
  let handlePlaceFarmhandShuffleWager: ReturnType<typeof vi.fn>
  let handleSettleFarmhandShuffleMatch: ReturnType<typeof vi.fn>
  let handleSaveFarmhandShuffleMatch: ReturnType<typeof vi.fn>
  let handleRefundUnresumableFarmhandShuffleMatch: ReturnType<typeof vi.fn>

  const renderWithContext = (
    gameStateOverrides: Partial<farmhand.state> = {}
  ) => {
    const contextValue = createContextData()

    handlePlaceFarmhandShuffleWager = vi.fn()
    handleSettleFarmhandShuffleMatch = vi.fn()
    handleSaveFarmhandShuffleMatch = vi.fn()
    handleRefundUnresumableFarmhandShuffleMatch = vi.fn()

    contextValue.gameState = {
      ...contextValue.gameState,
      ...testState({
        playerId: 'test-player-id',
        money: 500,
        ...gameStateOverrides,
      }),
    }

    contextValue.handlers = {
      ...contextValue.handlers,
      handlePlaceFarmhandShuffleWager,
      handleSettleFarmhandShuffleMatch,
      handleSaveFarmhandShuffleMatch,
      handleRefundUnresumableFarmhandShuffleMatch,
    } as any

    return render(
      <FarmhandContext.Provider value={contextValue}>
        <FarmhandShuffleView />
      </FarmhandContext.Provider>
    )
  }

  beforeEach(() => {
    matchPropsRef.current = null
  })

  describe('when no match is in progress', () => {
    test('renders the wager form', () => {
      renderWithContext()

      expect(screen.getByText('Farmhand Shuffle')).toBeInTheDocument()
      expect(
        screen.getByRole('button', { name: 'Start Match' })
      ).toBeInTheDocument()
      expect(screen.queryByTestId('match')).not.toBeInTheDocument()
    })

    test('submitting the wager form calls handlePlaceFarmhandShuffleWager', async () => {
      const user = userEvent.setup()

      renderWithContext()

      await user.click(screen.getByRole('button', { name: 'Start Match' }))

      expect(handlePlaceFarmhandShuffleWager).toHaveBeenCalledWith(0)
    })

    test('the Start Match button is disabled when the wager exceeds current money', async () => {
      renderWithContext({ money: 0 })

      const startButton = screen.getByRole('button', { name: 'Start Match' })

      expect(startButton).not.toBeDisabled()
    })

    test('mounts the embedded Match after placing a wager', async () => {
      const user = userEvent.setup()

      renderWithContext()

      await user.click(screen.getByRole('button', { name: 'Start Match' }))

      expect(screen.getByTestId('match')).toBeInTheDocument()
    })
  })

  describe('when a match is already in progress', () => {
    test('mounts the embedded Match immediately', () => {
      renderWithContext({
        farmhandShuffle: {
          isMatchInProgress: true,
          wager: 50,
          serializedMatch: null,
          totalMatchesPlayed: 0,
          totalWins: 0,
          totalLosses: 0,
          currentWinStreak: 0,
          longestWinStreak: 0,
        },
      })

      expect(screen.getByTestId('match')).toBeInTheDocument()
    })

    test('calls handleSettleFarmhandShuffleMatch when onMatchEnd fires', () => {
      renderWithContext({
        farmhandShuffle: {
          isMatchInProgress: true,
          wager: 50,
          serializedMatch: null,
          totalMatchesPlayed: 0,
          totalWins: 0,
          totalLosses: 0,
          currentWinStreak: 0,
          longestWinStreak: 0,
        },
      })

      matchPropsRef.current.onMatchEnd('test-player-id')

      expect(handleSettleFarmhandShuffleMatch).toHaveBeenCalledWith(
        'test-player-id',
        'test-player-id'
      )
    })

    test('calls handleSaveFarmhandShuffleMatch when onCheckpoint fires', () => {
      renderWithContext({
        farmhandShuffle: {
          isMatchInProgress: true,
          wager: 50,
          serializedMatch: null,
          totalMatchesPlayed: 0,
          totalWins: 0,
          totalLosses: 0,
          currentWinStreak: 0,
          longestWinStreak: 0,
        },
      })

      matchPropsRef.current.onCheckpoint({
        matchState: 'WAITING_FOR_PLAYER_TURN_ACTION',
        match: { fake: 'match' },
        botState: { fake: 'botState' },
      })

      expect(handleSaveFarmhandShuffleMatch).toHaveBeenCalledWith(
        expect.objectContaining({
          libraryVersion: '0.0.1',
          matchState: 'WAITING_FOR_PLAYER_TURN_ACTION',
          userPlayerId: 'test-player-id',
        })
      )
    })

    test('renders renderGameOverContent inside the game-over dialog slot', () => {
      renderWithContext({
        farmhandShuffle: {
          isMatchInProgress: true,
          wager: 50,
          serializedMatch: null,
          totalMatchesPlayed: 0,
          totalWins: 0,
          totalLosses: 0,
          currentWinStreak: 1,
          longestWinStreak: 1,
        },
      })

      const content = matchPropsRef.current.renderGameOverContent(
        'test-player-id'
      )

      render(<>{content}</>)

      expect(screen.getByText('You won $100.00!')).toBeInTheDocument()
    })

    test('renders a $0 wager result as "no wager placed" instead of "+$0"', () => {
      renderWithContext({
        farmhandShuffle: {
          isMatchInProgress: true,
          wager: 0,
          serializedMatch: null,
          totalMatchesPlayed: 0,
          totalWins: 0,
          totalLosses: 0,
          currentWinStreak: 0,
          longestWinStreak: 0,
        },
      })

      const content = matchPropsRef.current.renderGameOverContent(
        'test-player-id'
      )

      render(<>{content}</>)

      expect(screen.getByText('No wager was placed.')).toBeInTheDocument()
    })

    test('returns to the wager form when isMatchInProgress is cleared externally (e.g. a forfeit) without onMatchEnd firing', () => {
      const farmhandShuffleInProgress = {
        isMatchInProgress: true,
        wager: 50,
        serializedMatch: null,
        totalMatchesPlayed: 0,
        totalWins: 0,
        totalLosses: 0,
        currentWinStreak: 0,
        longestWinStreak: 0,
      }

      const { rerender } = renderWithContext({
        farmhandShuffle: farmhandShuffleInProgress,
      })

      expect(screen.getByTestId('match')).toBeInTheDocument()

      const contextValue = createContextData()

      contextValue.gameState = {
        ...contextValue.gameState,
        ...testState({
          playerId: 'test-player-id',
          money: 500,
          farmhandShuffle: {
            ...farmhandShuffleInProgress,
            isMatchInProgress: false,
            wager: 0,
            totalMatchesPlayed: 1,
            totalLosses: 1,
          },
        }),
      }

      contextValue.handlers = {
        ...contextValue.handlers,
        handlePlaceFarmhandShuffleWager,
        handleSettleFarmhandShuffleMatch,
        handleSaveFarmhandShuffleMatch,
        handleRefundUnresumableFarmhandShuffleMatch,
      } as any

      rerender(
        <FarmhandContext.Provider value={contextValue}>
          <FarmhandShuffleView />
        </FarmhandContext.Provider>
      )

      expect(screen.queryByTestId('match')).not.toBeInTheDocument()
      expect(
        screen.getByRole('button', { name: 'Start Match' })
      ).toBeInTheDocument()
    })

    test('sets hideDefaultGameOverActions', () => {
      renderWithContext({
        farmhandShuffle: {
          isMatchInProgress: true,
          wager: 50,
          serializedMatch: null,
          totalMatchesPlayed: 0,
          totalWins: 0,
          totalLosses: 0,
          currentWinStreak: 0,
          longestWinStreak: 0,
        },
      })

      expect(matchPropsRef.current.hideDefaultGameOverActions).toBe(true)
    })
  })

  describe('when resuming fails', () => {
    test('calls handleRefundUnresumableFarmhandShuffleMatch and falls back to the wager form on a library version mismatch', () => {
      renderWithContext({
        farmhandShuffle: {
          isMatchInProgress: true,
          wager: 50,
          serializedMatch: {
            libraryVersion: '0.0.0-stale',
            matchState: 'WAITING_FOR_PLAYER_TURN_ACTION' as MatchState,
            match: {} as any,
            botState: {} as any,
            userPlayerId: 'test-player-id',
            opponentPlayerId: 'farmhand-shuffle-bot',
          },
          totalMatchesPlayed: 0,
          totalWins: 0,
          totalLosses: 0,
          currentWinStreak: 0,
          longestWinStreak: 0,
        },
      })

      expect(handleRefundUnresumableFarmhandShuffleMatch).toHaveBeenCalled()
    })
  })
})
