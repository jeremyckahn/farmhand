import React from 'react'
import { func, number } from 'prop-types'
import Fab from '@material-ui/core/Fab'
import KeyboardArrowUp from '@material-ui/icons/KeyboardArrowUp'
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown'
import NumberFormat from 'react-number-format'
import TextField from '@material-ui/core/TextField'

import AnimatedNumber from '../AnimatedNumber'

import { integerString } from '../../utils'

import './QuantityInput.sass'

const QuantityNumberFormat = ({ inputRef, min, max, onChange, ...rest }) => (
  <NumberFormat
    isNumericString
    thousandSeparator
    {...{
      ...rest,
      allowNegative: false,
      decimalScale: 0,
      onValueChange: ({ floatValue = 0 }) =>
        onChange(Math.min(floatValue, max)),
    }}
  />
)

const QuantityTextInput = ({
  handleSubmit,
  handleUpdateNumber,
  maxQuantity,
  value,
}) => (
  <TextField
    {...{
      value,
      inputProps: {
        pattern: '[0-9]*',
        min: 0,
        max: maxQuantity,
      },
      onChange: handleUpdateNumber,
      onFocus: () => {
        // clear the input when input is first selected so the user doesn't have to fight with clearing out default values
        handleUpdateNumber(undefined)
      },
      // Bind to keyup to prevent spamming the event handler.
      onKeyUp: ({ which }) => {
        // Enter
        if (which === 13) {
          handleSubmit()
        }
      },

      InputProps: {
        inputComponent: QuantityNumberFormat,
      },
    }}
  />
)

const QuantityInput = ({
  handleSubmit,
  handleUpdateNumber,
  maxQuantity,
  setQuantity,
  value,
}) => {
  const decrementQuantity = () => {
    var newValue = value - 1
    if (newValue === 0) {
      newValue = maxQuantity
    }
    setQuantity(newValue)
  }

  const incrementValue = () => {
    var newValue = value + 1
    if (newValue > maxQuantity) {
      newValue = 1
    }
    setQuantity(newValue)
  }

  return (
    <div className="QuantityInput">
      <QuantityTextInput
        {...{ handleSubmit, handleUpdateNumber, maxQuantity, value }}
      />
      <span className="quantity">
        /{' '}
        <AnimatedNumber
          {...{ number: maxQuantity, formatter: integerString }}
        />
      </span>
      <div className="number-nudger-container">
        <Fab
          disabled={!value}
          {...{
            'aria-label': 'Increment',
            color: 'primary',
            onClick: incrementValue,
            size: 'small',
          }}
        >
          <KeyboardArrowUp />
        </Fab>
        <Fab
          disabled={!value}
          {...{
            'aria-label': 'Decrement',
            color: 'primary',
            onClick: decrementQuantity,
            size: 'small',
          }}
        >
          <KeyboardArrowDown />
        </Fab>
      </div>
    </div>
  )
}

QuantityInput.propTypes = {
  handleSubmit: func.isRequired,
  handleUpdateNumber: func.isRequired,
  maxQuantity: number.isRequired,
  setQuantity: func.isRequired,
  value: number,
}

QuantityInput.defaultProps = {
  value: 1,
}

export default QuantityInput
