import React from 'react'
import { render, screen } from '@testing-library/react'

import { levelAchieved } from '../../../utils/levelAchieved.js'

import OnlinePeer from './OnlinePeer.js'

const defaultPeer = {
  cowOfferedForTrade: null,
  dayCount: 5,
  playerId: 'test-peer-123',
  experience: 100,
  money: 1500,
}

test('renders', () => {
  render(<OnlinePeer peer={defaultPeer} />)
  expect(screen.getByText('Energetic Giraffe')).toBeInTheDocument()
})

test('displays peer information correctly', () => {
  render(<OnlinePeer peer={defaultPeer} />)

  expect(screen.getByText('Energetic Giraffe')).toBeInTheDocument()
  expect(screen.getByText('Day: 5')).toBeInTheDocument()
  expect(screen.getByText('Level: 2')).toBeInTheDocument()
  expect(screen.getByText('Money: $1,500.00')).toBeInTheDocument()
})

test('displays peer with experience level', () => {
  const peer = {
    ...defaultPeer,
    experience: 10000,
  }

  render(<OnlinePeer peer={peer} />)

  const expectedLevel = levelAchieved(peer.experience)
  expect(screen.getByText(`Level: ${expectedLevel}`)).toBeInTheDocument()
})

test('displays money amounts correctly', () => {
  const richPeer = {
    ...defaultPeer,
    money: 1234567,
  }

  render(<OnlinePeer peer={richPeer} />)

  expect(screen.getByText('Money: $1,234,567.00')).toBeInTheDocument()
})

test('displays day count correctly', () => {
  const experiencedPeer = {
    ...defaultPeer,
    dayCount: 1000,
  }

  render(<OnlinePeer peer={experiencedPeer} />)

  expect(screen.getByText('Day: 1,000')).toBeInTheDocument()
})

test('does not render CowCard when no cow is offered for trade', () => {
  render(<OnlinePeer peer={defaultPeer} />)

  expect(document.querySelector('.CowCard')).not.toBeInTheDocument()
})

test('renders CowCard when cow is offered for trade', () => {
  const peerWithCow = {
    ...defaultPeer,
    cowOfferedForTrade: {
      id: 'test-cow',
      name: 'Test Cow',
      color: 'BROWN',
      baseWeight: 1000,
      weightMultiplier: 1,
      daysOld: 30,
      happiness: 0.8,
      gender: 'FEMALE',
      colorsInBloodline: { BROWN: true },
      originalOwnerId: 'peer-123',
    },
  }

  render(<OnlinePeer peer={peerWithCow} />)

  expect(document.querySelector('.CowCard')).toBeInTheDocument()
})

test('renders card structure correctly', () => {
  render(<OnlinePeer peer={defaultPeer} />)

  expect(document.querySelector('.MuiCard-root')).toBeInTheDocument()
  expect(document.querySelector('.MuiCardHeader-root')).toBeInTheDocument()
  expect(document.querySelector('.MuiCardContent-root')).toBeInTheDocument()
})
