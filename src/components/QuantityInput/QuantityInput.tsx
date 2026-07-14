import React, { forwardRef } from 'react'
import { func, number } from 'prop-types'
import Fab from '@mui/material/Fab/index.js'
import KeyboardArrowUp from '@mui/icons-material/KeyboardArrowUp.js'
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown.js'
import NumberFormat from 'react-number-format'
import TextField from '@mui/material/TextField/index.js'

import { integerString } from '../../utils/integerString.js'
import AnimatedNumber from '../AnimatedNumber/index.js'
import { Div, Span } from '../Elements/index.js'
import { breakpoints } from '../../styles/tokens.js'

export const QUANTITY_INPUT_PLACEHOLDER_TEXT = '0'

export interface QuantityInputProps {
  handleSubmit: () => void
  handleUpdateNumber: (e: any) => void
  maxQuantity: number
  setQuantity: (quantity: number) => void
  value: number
}

const QuantityNumberFormat = forwardRef(
  (
    {
      min,
      max,
      onChange,
      ...rest
    }: {
      min?: number
      max: number
      onChange: (value: number) => void
    } & Record<string, unknown>,
    ref: React.ForwardedRef<HTMLInputElement>
  ) => (
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
}: Pick<
  QuantityInputProps,
  'handleSubmit' | 'handleUpdateNumber' | 'maxQuantity' | 'value'
>) => {
  return (
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
}: QuantityInputProps) => {
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
    <Div
      className="QuantityInput"
      sx={{
        '& .MuiInput-root': {
          margin: '1px 0.25em 0',
          [`@media (max-width: ${breakpoints.mediumPhone}px)`]: {
            margin: '0 0.25em 0 0.5em',
          },
          '& input': { textAlign: 'right' },
        },
      }}
    >
      <QuantityTextInput
        {...{ handleSubmit, handleUpdateNumber, maxQuantity, value }}
      />
      <Div
        className="number-nudger-container"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          position: 'absolute',
          top: '0.25em',
          right: 0,
          '& button': {
            margin: '0.25em 0.5em',
            '& svg': { marginBottom: 0 },
          },
        }}
      >
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
      </Div>
    </Div>
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
