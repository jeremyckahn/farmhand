import React, { useState } from 'react'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import AccountBalanceIcon from '@material-ui/icons/AccountBalance'
import NumberFormat from 'react-number-format'
import { func, number } from 'prop-types'

import FarmhandContext from '../../Farmhand.context'
import { moneyString } from '../../utils'
import { LOAN_INTEREST_RATE, LOAN_GARNISHMENT_RATE } from '../../constants'

import './AccountingView.sass'

const AccountingView = ({
  handleClickLoanPaydownButton,
  loanBalance,
  money,
}) => {
  const maxInputValue = Math.min(loanBalance, money)
  const [loanInputValue, setLoanInputValue] = useState(maxInputValue)

  return (
    <div className="AccountingView">
      <Card>
        <CardHeader
          {...{
            avatar: <AccountBalanceIcon />,
            title: 'Loan Balance',
            subheader: <p>{moneyString(loanBalance)}</p>,
          }}
        />
        <CardContent>
          <div className="loan-container">
            <TextField
              {...{
                value: String(loanInputValue),
                inputProps: {
                  // Enable a helpful number input for iOS.
                  // https://css-tricks.com/finger-friendly-numerical-inputs-with-inputmode/
                  pattern: '[0-9]*',
                },
                InputProps: {
                  inputComponent: ({ inputRef, ...rest }) => (
                    <NumberFormat
                      fixedDecimalScale
                      thousandSeparator
                      isNumericString
                      {...{
                        ...rest,
                        allowNegative: false,
                        decimalScale: 2,
                        prefix: '$',
                        isAllowed: ({ floatValue = 0 }) =>
                          floatValue >= 0 && floatValue <= maxInputValue,
                        onBlur: ({ target: { value } }) =>
                          setLoanInputValue(Number(value.replace(/[$,]/g, ''))),
                      }}
                    />
                  ),
                },
              }}
            />
            <Button
              {...{
                color: 'primary',
                disabled: loanBalance === 0,
                variant: 'contained',
                onClick: () => {
                  handleClickLoanPaydownButton(loanInputValue)
                  setLoanInputValue(loanBalance - loanInputValue)
                },
              }}
            >
              Pay into loan
            </Button>
            <p>
              You may take out a loan at any time. So long as you have a loan
              balance, all farm product sales are garnished by{' '}
              {LOAN_GARNISHMENT_RATE * 100}% until the loan is repaid. The loan
              interest rate is {LOAN_INTEREST_RATE * 100}% and compounds daily.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

AccountingView.propTypes = {
  handleClickLoanPaydownButton: func.isRequired,
  loanBalance: number.isRequired,
  money: number.isRequired,
}

export default function Consumer(props) {
  return (
    <FarmhandContext.Consumer>
      {({ gameState, handlers }) => (
        <AccountingView {...{ ...gameState, ...handlers, ...props }} />
      )}
    </FarmhandContext.Consumer>
  )
}
