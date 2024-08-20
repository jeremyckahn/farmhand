import React, { useEffect, useState } from 'react'
import { tween } from 'shifty'
import { func, number } from 'prop-types'

const defaultFormatter = (/** @type {number} */ number) => `${number}`

const AnimatedNumber = ({ number, formatter = defaultFormatter }) => {
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

  return <span className="AnimatedNumber">{formatter(displayedNumber)}</span>
}

AnimatedNumber.propTypes = {
  formatter: func,
  number: number.isRequired,
}

export default AnimatedNumber
