import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { vi } from 'vitest'

import { BOT_PLAYER_ID } from '../FarmhandShuffleView/FarmhandShuffleView.js'

import { FarmhandShuffleContextMenu } from './FarmhandShuffleContextMenu.js'

const baseFarmhandShuffle: farmhand.state['farmhandShuffle'] = {
  isMatchInProgress: false,
  wager: 0,
  serializedMatch: null,
  totalMatchesPlayed: 4,
  totalWins: 3,
  totalLosses: 1,
  currentWinStreak: 2,
  longestWinStreak: 2,
}

describe('FarmhandShuffleContextMenu', () => {
  test('shows the win/loss record and streak', () => {
    render(
      <FarmhandShuffleContextMenu
        {...{
          farmhandShuffle: baseFarmhandShuffle,
          playerId: 'player-1',
          handleSettleFarmhandShuffleMatch: vi.fn(),
        }}
      />
    )

    expect(screen.getByText('Wins: 3')).toBeInTheDocument()
    expect(screen.getByText('Losses: 1')).toBeInTheDocument()
    expect(screen.getByText('Current win streak: 2')).toBeInTheDocument()
  })

  test('does not show wager info or a forfeit button when no match is in progress', () => {
    render(
      <FarmhandShuffleContextMenu
        {...{
          farmhandShuffle: baseFarmhandShuffle,
          playerId: 'player-1',
          handleSettleFarmhandShuffleMatch: vi.fn(),
        }}
      />
    )

    expect(screen.queryByText(/Wager:/)).not.toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: /Forfeit Match/i })
    ).not.toBeInTheDocument()
  })

  test('shows the wager/prize line and a forfeit button when a match is in progress', () => {
    render(
      <FarmhandShuffleContextMenu
        {...{
          farmhandShuffle: {
            ...baseFarmhandShuffle,
            isMatchInProgress: true,
            wager: 50,
          },
          playerId: 'player-1',
          handleSettleFarmhandShuffleMatch: vi.fn(),
        }}
      />
    )

    expect(
      screen.getByText('Wager: $50.00 · Prize: $100.00')
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /Forfeit Match/i })
    ).toBeInTheDocument()
  })

  test('forfeiting settles the match with the bot as the winner, counting it as a loss', () => {
    const handleSettleFarmhandShuffleMatch = vi.fn()

    render(
      <FarmhandShuffleContextMenu
        {...{
          farmhandShuffle: {
            ...baseFarmhandShuffle,
            isMatchInProgress: true,
            wager: 50,
          },
          playerId: 'player-1',
          handleSettleFarmhandShuffleMatch,
        }}
      />
    )

    fireEvent.click(screen.getByRole('button', { name: /Forfeit Match/i }))

    expect(screen.getByText('Forfeit match?')).toBeInTheDocument()
    expect(
      screen.getByText(/You'll lose your \$50.00 wager/)
    ).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /Do it/i }))

    expect(handleSettleFarmhandShuffleMatch).toHaveBeenCalledWith(
      BOT_PLAYER_ID,
      'player-1'
    )
  })

  test('cancelling the forfeit dialog does not settle the match', () => {
    const handleSettleFarmhandShuffleMatch = vi.fn()

    render(
      <FarmhandShuffleContextMenu
        {...{
          farmhandShuffle: {
            ...baseFarmhandShuffle,
            isMatchInProgress: true,
            wager: 50,
          },
          playerId: 'player-1',
          handleSettleFarmhandShuffleMatch,
        }}
      />
    )

    fireEvent.click(screen.getByRole('button', { name: /Forfeit Match/i }))
    fireEvent.click(screen.getByRole('button', { name: /Cancel/i }))

    expect(handleSettleFarmhandShuffleMatch).not.toHaveBeenCalled()
  })
})
