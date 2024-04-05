import React, { useEffect, useState } from 'react'
import { tween } from 'shifty'
import { func, number, object } from 'prop-types'

import { Span } from '../Elements'
import './AnimatedNumber.sass'

const defaultFormatter = number => `${number}`

const AnimatedNumber = ({
  number,
  animatedNumberSx,
  formatter = defaultFormatter,
}) => {
  const [displayedNumber, setDisplayedNumber] = useState(number)
  const [previousNumber, setPreviousNumber] = useState(number)
  const [currentTweenable, setCurrentTweenable] = useState()

  useEffect(() => {
    setPreviousNumber(number)
  }, [number, setPreviousNumber])

  useEffect(() => {
    if (number !== previousNumber) {
      if (currentTweenable) {
        currentTweenable.cancel()
      }

      const tweenable = tween({
        easing: 'easeOutQuad',
        duration: 750,
        render: ({ number }) => {
          setDisplayedNumber(number)
        },
        from: {
          number: previousNumber,
        },
        to: { number },
      })

      setCurrentTweenable(tweenable)
    }

    return () => {
      if (currentTweenable) {
        currentTweenable.cancel()
      }
    }
  }, [currentTweenable, number, previousNumber])
  return (
    <Span className="AnimatedNumber" sx={animatedNumberSx}>
      {formatter(displayedNumber)}
    </Span>
  )
}

AnimatedNumber.propTypes = {
  formatter: func,
  number: number.isRequired,
  animatedNumberSx: object,
}

export default AnimatedNumber
