import React, { createRef } from 'react'
import { render, screen } from '@testing-library/react'
import Tooltip from '@mui/material/Tooltip/index.js'

import { createPixelIcon, flipX, flipY, rotate } from './createPixelIcon.js'

const TestIcon = createPixelIcon(['#.', '+#'], 'Test')

describe('createPixelIcon', () => {
  test('renders an SvgIcon with a test id derived from its name', () => {
    render(<TestIcon />)

    const icon = screen.getByTestId('TestIcon')

    expect(icon.tagName.toLowerCase()).toBe('svg')
    expect(icon).toHaveAttribute('viewBox', '0 0 2 2')
  })

  test('forwards refs to the underlying svg element', () => {
    const ref = createRef<SVGSVGElement>()

    render(<TestIcon ref={ref} />)

    expect(ref.current).toBe(screen.getByTestId('TestIcon'))
  })

  test('can be the direct child of a Tooltip', () => {
    const consoleError = vitest
      .spyOn(console, 'error')
      .mockImplementation(() => {})

    render(
      <Tooltip title="Tip">
        <TestIcon />
      </Tooltip>
    )

    // Tooltip anchors to its child via a ref; without forwardRef React warns
    // that function components cannot be given refs.
    expect(consoleError).not.toHaveBeenCalled()
    consoleError.mockRestore()
  })
})

describe('pixel map transforms', () => {
  const map = ['ab', 'cd']

  test('flipX mirrors horizontally', () => {
    expect(flipX(map)).toEqual(['ba', 'dc'])
  })

  test('flipY mirrors vertically', () => {
    expect(flipY(map)).toEqual(['cd', 'ab'])
  })

  test('rotate turns the map 90 degrees clockwise', () => {
    expect(rotate(map)).toEqual(['ca', 'db'])
  })
})
