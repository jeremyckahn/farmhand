import React from 'react'
import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'

import { OnlinePeersView } from './OnlinePeersView.js'

// Mock getPlayerName to return predictable values
vi.mock('../../utils/index.js', async () => {
  const actual = await vi.importActual('../../utils/index.js')
  return {
    ...actual,
    getPlayerName: vi.fn(id => id), // Return the ID as-is for testing
  }
})

const defaultProps = {
  activePlayers: 1,
  cowIdOfferedForTrade: '',
  cowInventory: [],
  playerId: 'test-player-123',
  latestPeerMessages: [],
  peers: {},
}

test('renders', () => {
  render(<OnlinePeersView {...defaultProps} />)
  expect(screen.getByText('Your player name')).toBeInTheDocument()
})

test('displays player name', () => {
  render(<OnlinePeersView {...defaultProps} playerId="my-player-id" />)

  expect(screen.getByText('Your player name')).toBeInTheDocument()
  expect(screen.getByText('my-player-id')).toBeInTheDocument()
})

test('shows loading message when there are more active players than populated peers', () => {
  const props = {
    ...defaultProps,
    activePlayers: 3,
    peers: {
      peer1: { playerId: 'peer1', dayCount: 1, experience: 100, money: 500 },
    },
  }

  render(<OnlinePeersView {...props} />)

  expect(screen.getByText('Getting player information...')).toBeInTheDocument()
})

test('does not show loading message when active players match populated peers', () => {
  const props = {
    ...defaultProps,
    activePlayers: 2, // 1 current player + 1 peer
    peers: {
      peer1: { playerId: 'peer1', dayCount: 1, experience: 100, money: 500 },
    },
  }

  render(<OnlinePeersView {...props} />)

  expect(
    screen.queryByText('Getting player information...')
  ).not.toBeInTheDocument()
})

test('displays cow offered for trade when present', () => {
  const cowOfferedForTrade = {
    id: 'test-cow',
    name: 'Test Cow',
    color: 'BROWN',
    colorsInBloodline: { BROWN: true },
    baseWeight: 1000,
    weightMultiplier: 1,
    daysOld: 30,
    happiness: 0.8,
    gender: 'FEMALE',
    daysSinceMilking: 0,
    daysSinceProducingFertilizer: 0,
    happinessBoostsToday: 0,
    isBred: false,
    isUsingHuggingMachine: false,
    ownerId: '',
    originalOwnerId: '',
    timesTraded: 0,
  }

  const props = {
    ...defaultProps,
    cowIdOfferedForTrade: 'test-cow',
    cowInventory: [cowOfferedForTrade],
  }

  render(<OnlinePeersView {...props} />)

  expect(screen.getByText('You are offering to trade away')).toBeInTheDocument()
  expect(document.querySelector('.CowCard')).toBeInTheDocument()
})

test('does not display trade section when no cow is offered', () => {
  render(<OnlinePeersView {...defaultProps} />)

  expect(
    screen.queryByText('You are offering to trade away')
  ).not.toBeInTheDocument()
})

test('displays list of peers when present', () => {
  const peers = {
    peer1: {
      playerId: 'peer1',
      dayCount: 5,
      experience: 100,
      money: 1000,
      cowOfferedForTrade: null,
    },
    peer2: {
      playerId: 'peer2',
      dayCount: 10,
      experience: 500,
      money: 2000,
      cowOfferedForTrade: null,
    },
  }

  render(<OnlinePeersView {...defaultProps} peers={peers} />)

  expect(screen.getByText('peer1')).toBeInTheDocument()
  expect(screen.getByText('peer2')).toBeInTheDocument()
})

test('sorts peers by experience level (highest first)', () => {
  const peers = {
    'low-level': {
      playerId: 'low-level',
      dayCount: 1,
      experience: 50,
      money: 500,
      cowOfferedForTrade: null,
    },
    'high-level': {
      playerId: 'high-level',
      dayCount: 20,
      experience: 2000,
      money: 5000,
      cowOfferedForTrade: null,
    },
  }

  render(<OnlinePeersView {...defaultProps} peers={peers} />)

  const peerElements = screen.getAllByText(/high-level|low-level/)
  const peerTexts = peerElements.map(el => el.textContent)

  // High level peer should appear before low level peer
  const highLevelIndex = peerTexts.findIndex(text =>
    text?.includes('high-level')
  )
  const lowLevelIndex = peerTexts.findIndex(text => text?.includes('low-level'))

  expect(highLevelIndex).toBeLessThan(lowLevelIndex)
})

test('filters out empty peer objects', () => {
  const peers = {
    'valid-peer': {
      playerId: 'valid-peer',
      dayCount: 5,
      experience: 100,
      money: 1000,
      cowOfferedForTrade: null,
    },
    'empty-peer': null,
  }

  render(<OnlinePeersView {...defaultProps} peers={peers} />)

  expect(screen.getByText('valid-peer')).toBeInTheDocument()
  expect(screen.queryByText('empty-peer')).not.toBeInTheDocument()
})

test('displays latest peer messages when present', () => {
  const latestPeerMessages = [
    {
      playerId: 'peer1',
      message: 'has joined the game',
      severity: 'info',
    },
    {
      playerId: 'peer2',
      message: 'offered a cow for trade',
      severity: 'success',
    },
  ]

  render(
    <OnlinePeersView
      {...defaultProps}
      latestPeerMessages={latestPeerMessages}
    />
  )

  expect(screen.getByText('peer1')).toBeInTheDocument()
  expect(screen.getByText('has joined the game')).toBeInTheDocument()
  expect(screen.getByText('peer2')).toBeInTheDocument()
  expect(screen.getByText('offered a cow for trade')).toBeInTheDocument()
})

test('does not display peer messages section when empty', () => {
  render(<OnlinePeersView {...defaultProps} />)

  const alerts = document.querySelectorAll('[role="alert"]')
  expect(alerts).toHaveLength(0)
})

test('uses default severity for peer messages when not specified', () => {
  const latestPeerMessages = [
    {
      playerId: 'peer1',
      message: 'did something',
    },
  ]

  render(
    <OnlinePeersView
      {...defaultProps}
      latestPeerMessages={latestPeerMessages}
    />
  )

  const alert = document.querySelector('[role="alert"]')
  expect(alert).toBeInTheDocument()
})

test('displays dividers between sections when content is present', () => {
  const cowOfferedForTrade = {
    id: 'test-cow',
    name: 'Test Cow',
    color: 'BROWN',
    colorsInBloodline: { BROWN: true },
    baseWeight: 1000,
    weightMultiplier: 1,
    daysOld: 30,
    happiness: 0.8,
    gender: 'FEMALE',
    daysSinceMilking: 0,
    daysSinceProducingFertilizer: 0,
    happinessBoostsToday: 0,
    isBred: false,
    isUsingHuggingMachine: false,
    ownerId: '',
    originalOwnerId: '',
    timesTraded: 0,
  }

  const peers = {
    peer1: {
      playerId: 'peer1',
      dayCount: 5,
      experience: 100,
      money: 1000,
      cowOfferedForTrade: null,
    },
  }

  const latestPeerMessages = [
    {
      playerId: 'peer1',
      message: 'test message',
      severity: 'info',
    },
  ]

  render(
    <OnlinePeersView
      {...defaultProps}
      cowIdOfferedForTrade="test-cow"
      cowInventory={[cowOfferedForTrade]}
      peers={peers}
      latestPeerMessages={latestPeerMessages}
    />
  )

  // Should have exactly 3 dividers: one before cow trade, one before peers, one before messages
  const dividers = document.querySelectorAll('.MuiDivider-root')
  expect(dividers).toHaveLength(3)

  // Get section elements to verify positioning
  const playerNameSection = screen.getByText('Your player name')
  const cowTradeSection = screen.getByText('You are offering to trade away')
  const peersListElement = document.querySelector('.card-list')
  const messagesListElement = document.querySelector('ul:not(.card-list)')

  // Verify all expected sections are present
  expect(playerNameSection).toBeInTheDocument()
  expect(cowTradeSection).toBeInTheDocument()
  expect(peersListElement).toBeInTheDocument()
  expect(messagesListElement).toBeInTheDocument()
  expect(screen.getByText('test message')).toBeInTheDocument()

  // Verify structural elements
  expect(document.querySelector('.CowCard')).toBeInTheDocument()
  expect(document.querySelector('[role="alert"]')).toBeInTheDocument()

  // Verify dividers are positioned between sections by checking specific elements
  const mainContainer = document.querySelector('.OnlinePeersView')
  expect(mainContainer).toBeInTheDocument()
  const children = Array.from(mainContainer?.children || [])

  // Find the indices of key elements
  const playerNameIndex = children.findIndex(el =>
    el.textContent?.includes('Your player name')
  )
  const firstDividerIndex = children.findIndex(
    (el, index) =>
      index > playerNameIndex && el.classList.contains('MuiDivider-root')
  )
  const cowTradeIndex = children.findIndex(el =>
    el.textContent?.includes('You are offering to trade away')
  )
  const secondDividerIndex = children.findIndex(
    (el, index) =>
      index > cowTradeIndex && el.classList.contains('MuiDivider-root')
  )
  const peersListIndex = children.findIndex(el =>
    el.classList.contains('card-list')
  )
  const thirdDividerIndex = children.findIndex(
    (el, index) =>
      index > peersListIndex && el.classList.contains('MuiDivider-root')
  )
  const messagesListIndex = children.findIndex(
    el => el.tagName === 'UL' && !el.classList.contains('card-list')
  )

  // Verify the order: playerName < firstDivider < cowTrade < secondDivider < peersList < thirdDivider < messagesList
  expect(playerNameIndex).toBeLessThan(firstDividerIndex)
  expect(firstDividerIndex).toBeLessThan(cowTradeIndex)
  expect(cowTradeIndex).toBeLessThan(secondDividerIndex)
  expect(secondDividerIndex).toBeLessThan(peersListIndex)
  expect(peersListIndex).toBeLessThan(thirdDividerIndex)
  expect(thirdDividerIndex).toBeLessThan(messagesListIndex)
})
