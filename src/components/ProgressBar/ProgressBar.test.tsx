import React from 'react'
import { render, screen, act } from '@testing-library/react'
import { vi } from 'vitest'

import ProgressBar from './ProgressBar.js'

// Mock shifty to control animations in tests
vi.mock('shifty', () => ({
  interpolate: vi.fn((from, to, position) => ({
    color: position >= 1 ? to.color : from.color,
  })),
  tween: vi.fn(),
}))

const { tween, interpolate } = await import('shifty')

describe('ProgressBar', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  test('renders', () => {
    render(<ProgressBar {...{ percent: 0 }} />)
    expect(document.querySelector('.ProgressBar')).toBeInTheDocument()
  })

  test('displays initial progress percentage', () => {
    render(<ProgressBar {...{ percent: 50 }} />)
    // Initially shows 0% before animation
    expect(screen.getByText('0%')).toBeInTheDocument()
  })

  test('renders progress bar with correct structure', () => {
    render(<ProgressBar {...{ percent: 75 }} />)

    const progressBar = document.querySelector('.ProgressBar')
    expect(progressBar).toBeInTheDocument()
  })

  test('sets initial progress width to 0%', () => {
    render(<ProgressBar {...{ percent: 100 }} />)

    const progress = document.querySelector('.progress')
    expect(progress).toHaveStyle('width: 0%')
  })

  test('initializes tween animation with correct parameters', () => {
    const mockTweenInstance = {
      cancel: vi.fn(),
    }
    // @ts-expect-error - Mock function type assertion
    tween.mockReturnValue(mockTweenInstance)

    render(<ProgressBar {...{ percent: 75 }} />)

    expect(tween).toHaveBeenCalledWith({
      delay: 750,
      easing: 'easeInOutQuad',
      duration: 1500,
      from: { currentPercent: 0 },
      to: { currentPercent: 75 },
      render: expect.any(Function),
    })
  })

  test('animates progress from 0 to target percentage', () => {
    let renderCallback
    const mockTweenInstance = {
      cancel: vi.fn(),
    }
    // @ts-expect-error - Mock function type assertion
    tween.mockImplementation(config => {
      renderCallback = config.render
      return mockTweenInstance
    })

    render(<ProgressBar {...{ percent: 50 }} />)

    // Simulate animation progress at 25%
    act(() => {
      renderCallback({ currentPercent: 25 })
    })

    expect(screen.getByText('25%')).toBeInTheDocument()
    expect(document.querySelector('.progress')).toHaveStyle('width: 25%')

    // Simulate animation progress at 50%
    act(() => {
      renderCallback({ currentPercent: 50 })
    })

    expect(screen.getByText('50%')).toBeInTheDocument()
    expect(document.querySelector('.progress')).toHaveStyle('width: 50%')
  })

  test('rounds progress percentage to 2 decimal places', () => {
    let renderCallback
    const mockTweenInstance = {
      cancel: vi.fn(),
    }
    // @ts-expect-error - Mock function type assertion
    tween.mockImplementation(config => {
      renderCallback = config.render
      return mockTweenInstance
    })

    render(<ProgressBar {...{ percent: 100 }} />)

    // Simulate animation with decimal progress
    act(() => {
      renderCallback({ currentPercent: 33.333333 })
    })

    expect(screen.getByText('33.33%')).toBeInTheDocument()
  })

  test('interpolates color during animation', () => {
    let renderCallback
    const mockTweenInstance = {
      cancel: vi.fn(),
    }
    // @ts-expect-error - Mock function type assertion
    tween.mockImplementation(config => {
      renderCallback = config.render
      return mockTweenInstance
    })

    const mockInterpolatedColor = '#7fa200'
    // @ts-expect-error - Mock function type assertion
    interpolate.mockReturnValue({ color: mockInterpolatedColor })

    render(<ProgressBar {...{ percent: 50 }} />)

    act(() => {
      renderCallback({ currentPercent: 50 })
    })

    expect(interpolate).toHaveBeenCalledWith(
      { color: '#ff9f00' },
      { color: '#00e500' },
      0.5
    )

    expect(document.querySelector('.progress')).toHaveStyle(
      `background: ${mockInterpolatedColor}`
    )
  })

  test('cancels previous animation when component unmounts', () => {
    const mockTweenInstance = {
      cancel: vi.fn(),
    }
    // @ts-expect-error - Mock function type assertion
    tween.mockReturnValue(mockTweenInstance)

    const { unmount } = render(<ProgressBar {...{ percent: 50 }} />)

    unmount()

    expect(mockTweenInstance.cancel).toHaveBeenCalled()
  })

  test('handles percent prop updates correctly', () => {
    const mockTweenInstance = {
      cancel: vi.fn(),
    }

    // @ts-expect-error - Mock function type assertion
    tween.mockReturnValue(mockTweenInstance)

    const { rerender } = render(<ProgressBar {...{ percent: 25 }} />)

    expect(tween).toHaveBeenCalledTimes(1)
    expect(tween).toHaveBeenLastCalledWith(
      expect.objectContaining({
        to: { currentPercent: 25 },
      })
    )

    // Update percent prop - this won't create a new tween since currentTweenable already exists
    rerender(<ProgressBar {...{ percent: 75 }} />)

    // Should still only have one tween call since the component only creates
    // a new tween when currentTweenable is falsy
    expect(tween).toHaveBeenCalledTimes(1)
  })

  test('starts with incomplete color initially', () => {
    render(<ProgressBar {...{ percent: 100 }} />)

    const progress = document.querySelector('.progress')
    expect(progress).toHaveStyle('background: #ff9f00')
  })

  test('maintains proper color interpolation at different progress points', () => {
    let renderCallback
    const mockTweenInstance = {
      cancel: vi.fn(),
    }
    // @ts-expect-error - Mock function type assertion
    tween.mockImplementation(config => {
      renderCallback = config.render
      return mockTweenInstance
    })

    render(<ProgressBar {...{ percent: 100 }} />)

    // Test at 0% progress
    // @ts-expect-error - Mock function type assertion
    interpolate.mockReturnValue({ color: '#ff9f00' })
    act(() => {
      renderCallback({ currentPercent: 0 })
    })
    expect(interpolate).toHaveBeenCalledWith(
      { color: '#ff9f00' },
      { color: '#00e500' },
      0
    )

    // Test at 100% progress
    // @ts-expect-error - Mock function type assertion
    interpolate.mockReturnValue({ color: '#00e500' })
    act(() => {
      renderCallback({ currentPercent: 100 })
    })
    expect(interpolate).toHaveBeenCalledWith(
      { color: '#ff9f00' },
      { color: '#00e500' },
      1
    )
  })
})
