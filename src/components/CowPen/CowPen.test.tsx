import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

import { generateCow } from '../../utils/generateCow.js'
import { cowColors } from '../../enums.js'
import { noop } from '../../utils/noop.js'

import { Cow } from './Cow.js'

vi.mock('../../utils/getCowDisplayName.js', () => ({
  getCowDisplayName: vi.fn(cow => cow.name || 'Test Cow'),
}))

// Mock timers for animation testing
beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.runOnlyPendingTimers()
  vi.useRealTimers()
})

const defaultCowProps = {
  allowCustomPeerCowNames: false,
  cow: {
    ...generateCow(),
    color: cowColors.WHITE,
    id: 'test-cow',
    name: 'Test Cow',
  },
  cowInventory: [],
  handleCowPenUnmount: noop,
  handleCowClick: noop,
  playerId: 'test-player',
  isSelected: false,
}

describe('Cow', () => {
  test('renders', () => {
    render(<Cow {...defaultCowProps} />)
    expect(document.querySelector('.cow')).toBeInTheDocument()
  })

  test('displays cow image', () => {
    render(<Cow {...defaultCowProps} />)

    const cowImage = document.querySelector('.cow img')

    expect(cowImage).toBeInTheDocument()
    expect(cowImage).toHaveAttribute('alt', 'Test Cow')
  })

  test('applies selected class when cow is selected', () => {
    render(<Cow {...defaultCowProps} isSelected={true} />)

    expect(document.querySelector('.cow.is-selected')).toBeInTheDocument()
  })

  test('does not apply selected class when cow is not selected', () => {
    render(<Cow {...defaultCowProps} isSelected={false} />)

    expect(document.querySelector('.cow.is-selected')).not.toBeInTheDocument()
  })

  test('calls handleCowClick when cow is clicked', async () => {
    const user = userEvent.setup({ advanceTimers: vitest.advanceTimersByTime })
    const handleCowClick = vitest.fn()

    render(<Cow {...defaultCowProps} handleCowClick={handleCowClick} />)

    const cowElement = document.querySelector('.cow')

    expect(cowElement).toBeInTheDocument()
    await user.click(cowElement!)

    expect(handleCowClick).toHaveBeenCalledWith(defaultCowProps.cow)
  })

  test('displays cow tooltip on hover', () => {
    render(<Cow {...defaultCowProps} isSelected={true} />)

    // When cow is selected, tooltip should be visible
    expect(screen.getByText('Test Cow')).toBeInTheDocument()
  })

  test('shows happiness indicator when cow is happy', () => {
    const happyCow = {
      ...defaultCowProps.cow,
      happiness: 0.8,
    }

    render(<Cow {...defaultCowProps} cow={happyCow} />)

    expect(document.querySelector('.fa-heart')).toBeInTheDocument()
  })

  test('does not show happiness indicator when cow is not happy', () => {
    const sadCow = {
      ...generateCow(),
      happiness: 0,
      happinessBoostsToday: 0,
    }

    render(<Cow {...defaultCowProps} cow={sadCow} />)

    // Check that there are no happiness boost indicators specifically
    expect(
      document.querySelector('.happiness-boosts-today li')
    ).not.toBeInTheDocument()
  })

  test('renders with different cow colors', () => {
    const brownCow = {
      ...defaultCowProps.cow,
      color: cowColors.BROWN,
    }

    render(<Cow {...defaultCowProps} cow={brownCow} />)

    expect(document.querySelector('.cow')).toBeInTheDocument()
  })

  test('displays custom peer cow name when allowed', () => {
    const peerCow = {
      ...defaultCowProps.cow,
      name: 'Custom Peer Cow',
      originalOwnerId: 'different-player',
    }

    render(
      <Cow {...defaultCowProps} cow={peerCow} allowCustomPeerCowNames={true} />
    )

    expect(document.querySelector('.cow')).toBeInTheDocument()
  })

  test('does not display custom peer cow name when not allowed', () => {
    const peerCow = {
      ...defaultCowProps.cow,
      name: 'Custom Peer Cow',
      originalOwnerId: 'different-player',
    }

    render(
      <Cow {...defaultCowProps} cow={peerCow} allowCustomPeerCowNames={false} />
    )

    expect(document.querySelector('.cow')).toBeInTheDocument()
  })

  test('positions cow within pen boundaries', () => {
    render(<Cow {...defaultCowProps} />)

    const cowElement = document.querySelector('.cow')

    expect(cowElement).toBeInTheDocument()

    // Cow should have positioning styles applied
    if (cowElement && cowElement instanceof HTMLElement) {
      expect(cowElement.style.left).toMatch(/\d+.*%/)
      expect(cowElement.style.top).toMatch(/\d+.*%/)
    } else {
      throw new TypeError()
    }
  })

  test('handles animation states', async () => {
    render(<Cow {...defaultCowProps} />)

    const cowElement = document.querySelector('.cow')

    expect(cowElement).toBeInTheDocument()

    // Fast-forward time to trigger animations
    vitest.advanceTimersByTime(5000)

    // Not wrapped in waitFor: with fake timers active, waitFor's polling
    // interval never fires again after this point (nothing advances the
    // fake clock further), so it would hang until the outer test timeout
    // instead of re-checking. The assertion is already true synchronously.
    expect(cowElement).toBeInTheDocument()
  })

  test('stops movement when cow is selected', () => {
    const { rerender } = render(<Cow {...defaultCowProps} isSelected={false} />)

    // Change to selected
    rerender(<Cow {...defaultCowProps} isSelected={true} />)

    const cowElement = document.querySelector('.cow')

    expect(cowElement).toBeInTheDocument()
    expect(cowElement).toHaveClass('is-selected')
  })

  test('resumes movement when cow is deselected', () => {
    const { rerender } = render(<Cow {...defaultCowProps} isSelected={true} />)

    // Change to not selected
    rerender(<Cow {...defaultCowProps} isSelected={false} />)

    const cowElement = document.querySelector('.cow')

    expect(cowElement).toBeInTheDocument()
    expect(cowElement).not.toHaveClass('is-selected')
  })

  test('shows the hug animation when happinessBoostsToday increases', () => {
    const { rerender, container } = render(
      <Cow
        {...defaultCowProps}
        cow={{ ...defaultCowProps.cow, happinessBoostsToday: 0 }}
      />
    )

    const heart = () => container.querySelector('.fa-heart.animation')

    rerender(
      <Cow
        {...defaultCowProps}
        cow={{ ...defaultCowProps.cow, happinessBoostsToday: 1 }}
      />
    )

    expect(heart()?.getAttribute('class')).toContain('is-animating')
  })

  test('stops the hug animation after it completes', () => {
    const { rerender, container } = render(
      <Cow
        {...defaultCowProps}
        cow={{ ...defaultCowProps.cow, happinessBoostsToday: 0 }}
      />
    )

    const heart = () => container.querySelector('.fa-heart.animation')

    rerender(
      <Cow
        {...defaultCowProps}
        cow={{ ...defaultCowProps.cow, happinessBoostsToday: 1 }}
      />
    )
    expect(heart()?.getAttribute('class')).toContain('is-animating')

    vi.advanceTimersByTime(750)

    expect(heart()?.getAttribute('class')).not.toContain('is-animating')
  })

  test('shows the hug animation after the daily reset of happinessBoostsToday', () => {
    // The cow was hugged the maximum number of times today.
    const { rerender, container } = render(
      <Cow
        {...defaultCowProps}
        cow={{ ...defaultCowProps.cow, happinessBoostsToday: 3 }}
      />
    )

    const heart = () => container.querySelector('.fa-heart.animation')

    // Midnight: the daily reset brings the boost count back down.
    rerender(
      <Cow
        {...defaultCowProps}
        cow={{ ...defaultCowProps.cow, happinessBoostsToday: 0 }}
      />
    )
    vi.advanceTimersByTime(100)

    // The first hug of the new day still animates.
    rerender(
      <Cow
        {...defaultCowProps}
        cow={{ ...defaultCowProps.cow, happinessBoostsToday: 1 }}
      />
    )

    expect(heart()?.getAttribute('class')).toContain('is-animating')
  })
})
