import React, { forwardRef } from 'react'
import { func, number } from 'prop-types'
import Fab from '@mui/material/Fab/index.js'
import KeyboardArrowUp from '@mui/icons-material/KeyboardArrowUp.js'
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown.js'
import NumberFormat from 'react-number-format'
import TextField from '@mui/material/TextField/index.js'

import { integerString } from '../../utils/index.js'
import AnimatedNumber from '../AnimatedNumber/index.js'
import { Span } from '../Elements/index.js'

import './QuantityInput.sass'

export const QUANTITY_INPUT_PLACEHOLDER_TEXT = '0'

const QuantityNumberFormat = forwardRef(
  /**
   * @param {Object} props
   * @param {number} props.min
   * @param {number} props.max
   * @param {(value: number) => void} props.onChange
   * @param {React.ForwardedRef<any>} ref
   */
  ({ min, max, onChange, ...rest }, ref) => (
    <NumberFormat
      isNumericString
      thousandSeparator
      getInputRef={ref}
      {...{
        ...rest,
        allowNegative: false,
        decimalScale: 0,
        onValueChange: ({ floatValue = 0 }) =>
          onChange(Math.min(floatValue, max)),
      }}
    />
  )
)

// TODO: Rename event handlers to use on* format
// https://github.com/jeremyckahn/farmhand/issues/414
const QuantityTextInput = ({
  handleSubmit,
  handleUpdateNumber,
  maxQuantity,
  value,
}) => {
  return (
    // @ts-expect-error
    <TextField
      variant="standard"
      {...{
        value,
        placeholder: QUANTITY_INPUT_PLACEHOLDER_TEXT,
        inputProps: {
          pattern: '[0-9]*',
          min: 0,
          max: maxQuantity,
        },
        onChange: handleUpdateNumber,
        onFocus: event => {
          // NOTE: This highlights the contents of the input so the user
          // doesn't have to fight with clearing out the default value.
          event.target.select()
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
          endAdornment: (
            <>
              <Span sx={{ px: 1 }}>/</Span>
              <AnimatedNumber
                {...{
                  number: maxQuantity,
                  formatter: integerString,
                }}
              />
            </>
          ),
        },
      }}
    />
  )
}

const QuantityInput = ({
  handleSubmit,
  handleUpdateNumber,
  maxQuantity,
  setQuantity,
  value,
}) => {
  const decrementQuantity = () => {
    let newValue = value - 1
    if (newValue === 0) {
      newValue = maxQuantity
    }
    setQuantity(newValue)
  }

  const incrementQuantity = () => {
    let newValue = value + 1
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
      <div className="number-nudger-container">
        <Fab
          disabled={!value}
          {...{
            'aria-label': 'Increment',
            color: 'primary',
            onClick: incrementQuantity,
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
