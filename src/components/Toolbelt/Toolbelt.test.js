import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { fieldMode } from '../../enums'

import { Toolbelt } from './Toolbelt'

let buttons = []

class ToolbeltTest extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      fieldMode: fieldMode.OBSERVE,
    }
  }

  handleFieldModeSelect = fieldMode => {
    this.setState({ fieldMode })
  }

  render() {
    return (
      <Toolbelt
        fieldMode={this.state.fieldMode}
        handleFieldModeSelect={this.handleFieldModeSelect}
      />
    )
  }
}

describe('<ToolBelt />', () => {
  const getSelectedButton = () => {
    return screen
      .getAllByRole('button')
      .find(b => b.classList.contains('selected'))
  }

  test('renders a button for each tool', () => {
    render(<ToolbeltTest />)
    expect(screen.getAllByRole('button')).toHaveLength(3)
  })

  describe('tool selection', () => {
    test('there are no selected tools by default', () => {
      render(<ToolbeltTest />)
      expect(getSelectedButton()).toBeUndefined()
    })

    test('marks the clicked button as selected', async () => {
      render(<ToolbeltTest />)
      buttons = screen.getAllByRole('button')

      await userEvent.click(buttons[0])

      expect(buttons[0].classList.contains('selected')).toEqual(true)
    })
  })
})
