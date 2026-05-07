import React, { useEffect, useState } from 'react'
// eslint-disable-next-line no-unused-vars
import { tween, Tweenable } from 'shifty'
import { func as funcProp, number as numberProp } from 'prop-types'

const defaultFormatter = (/** @type {number} */ num) => `${num}`

/**
 * AnimatedNumber component that displays a number with an animation effect.
 *
 * @param props - The component properties.
 * @param props.number - The number to display.
 * @param [props.formatter=defaultFormatter] - A function to format the number before displaying it.
 * @returns {JSX.Element} - The JSX element representing the animated number.
 */
const AnimatedNumber = ({ number, formatter = defaultFormatter }) => {
  const [displayedNumber, setDisplayedNumber] = useState(number)
  const [previousNumber, setPreviousNumber] = useState(number)
  const [currentTweenable, setCurrentTweenable] = useState<
    Tweenable | undefined
  >()

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
        render: ({ number: tweenedNumber }) => {
          setDisplayedNumber(Number(tweenedNumber))
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
  formatter: funcProp,
  number: numberProp.isRequired,
}

export default AnimatedNumber
