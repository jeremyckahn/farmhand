import React, { useEffect, useState, forwardRef } from 'react'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import NumberFormat from 'react-number-format'
import { func, number } from 'prop-types'

import FarmhandContext from '../Farmhand/Farmhand.context'
import { moneyString } from '../../utils/moneyString'
import { dollarString, moneyTotal } from '../../utils'
import {
  STANDARD_LOAN_AMOUNT,
  LOAN_INTEREST_RATE,
  LOAN_GARNISHMENT_RATE,
} from '../../constants'

import './AccountingView.sass'

const MoneyNumberFormat = forwardRef(
  ({ max, min, onChange, setLoanInputValue, ...rest }, ref) => (
    <NumberFormat
      fixedDecimalScale
      thousandSeparator
      getInputRef={ref}
      {...{
        ...rest,
        allowNegative: false,
        decimalScale: 2,
        prefix: '$',
        isAllowed: ({ floatValue = 0 }) => min >= 0 && floatValue <= max,
        onValueChange: ({ floatValue = 0 }) => onChange(floatValue),
      }}
    />
  )
)

const AccountingView = ({
  handleClickLoanPaydownButton,
  handleClickTakeOutLoanButton,
  loanBalance,
  money,
}) => {
  const [loanInputValue, setLoanInputValue] = useState(
    Math.min(loanBalance, money)
  )

  useEffect(() => setLoanInputValue(Math.min(loanBalance, money)), [
    loanBalance,
    money,
  ])

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
              variant="standard"
              {...{
                value: loanInputValue,
                inputProps: {
                  max: loanBalance,
                  min: 0,

                  // Enable a helpful number input for iOS.
                  // https://css-tricks.com/finger-friendly-numerical-inputs-with-inputmode/
                  pattern: '[0-9]*',
                },

                onChange: setLoanInputValue,
                InputProps: {
                  inputComponent: MoneyNumberFormat,
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
              You may take out a Hardship Assistance Loan if your funds fall
              below {dollarString(STANDARD_LOAN_AMOUNT)}. So long as you have an
              outstanding loan balance, all farm product sales are garnished by{' '}
              {LOAN_GARNISHMENT_RATE * 100}% until the loan is repaid. The loan
              interest rate is {LOAN_INTEREST_RATE * 100}% per day, compounded
              daily.
            </p>
          </div>
          <Button
            {...{
              color: 'error',
              disabled: money >= STANDARD_LOAN_AMOUNT,
              onClick: () => {
                handleClickTakeOutLoanButton(STANDARD_LOAN_AMOUNT)
                setLoanInputValue(
                  Math.min(
                    moneyTotal(loanInputValue, STANDARD_LOAN_AMOUNT),
                    moneyTotal(money, STANDARD_LOAN_AMOUNT)
                  )
                )
              },
              variant: 'contained',
            }}
          >
            Take out a {dollarString(STANDARD_LOAN_AMOUNT)} loan
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

AccountingView.propTypes = {
  handleClickTakeOutLoanButton: func.isRequired,
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
