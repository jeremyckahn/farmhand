import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

import FarmhandContext, {
  createContextData,
} from '../Farmhand/Farmhand.context.js'

import { STANDARD_LOAN_AMOUNT } from '../../constants.js'

import AccountingView from './AccountingView.js'

describe('<AccountView />', () => {
  let handleClickLoanPaydownButton, handleClickTakeOutLoanButton

  beforeEach(() => {
    const contextValue = createContextData()

    handleClickLoanPaydownButton = vi.fn()
    handleClickTakeOutLoanButton = vi.fn()

    render(
      <FarmhandContext.Provider value={contextValue}>
        <AccountingView
          {...{
            handleClickLoanPaydownButton,
            handleClickTakeOutLoanButton,
            loanBalance: 1000,
            money: 1,
          }}
        />
      </FarmhandContext.Provider>
    )
  })

  const getPayLoanButton = () =>
    screen.getByRole('button', { name: 'Pay into loan' })

  const getTakeOutLoanButton = () =>
    screen.getByRole('button', { name: /Take out a \$(\d)+ loan/ })

  describe('render', () => {
    test('displays the heading', () => {
      expect(screen.getByText('Loan Balance')).toBeInTheDocument()
    })

    test('it displays the loan input', () => {
      expect(screen.getByRole('textbox')).toBeInTheDocument()
    })

    test('it has a button for paying the loan', () => {
      expect(getPayLoanButton()).toBeInTheDocument()
    })

    test('it has a button for taking out a loan', () => {
      expect(getTakeOutLoanButton()).toBeInTheDocument()
    })
  })

  describe('interactions', () => {
    it('calls the pay loan callback when pay loan is clicked', async () => {
      const user = userEvent.setup()
      await user.click(getPayLoanButton())

      expect(handleClickLoanPaydownButton).toHaveBeenCalledWith(1)
    })

    it('calls the take out loan callback when take out loan is pressed', async () => {
      const user = userEvent.setup()
      await user.click(getTakeOutLoanButton())

      expect(handleClickTakeOutLoanButton).toHaveBeenCalledWith(
        STANDARD_LOAN_AMOUNT
      )
    })
  })
})
