import React, { useEffect, useState } from 'react'
// eslint-disable-next-line no-unused-vars
import { tween, Tweenable } from 'shifty'
import { func, number } from 'prop-types'

const defaultFormatter = (/** @type {number} */ number) => `${number}`

/**
 * AnimatedNumber component that displays a number with an animation effect.
 *
 * @param {Object} props - The component properties.
 * @param {number} props.number - The number to display.
 * @param {typeof defaultFormatter} [props.formatter=defaultFormatter] - A function to format the number before displaying it.
 * @returns {JSX.Element} - The JSX element representing the animated number.
 */
const AnimatedNumber = ({ number, formatter = defaultFormatter }) => {
  const [displayedNumber, setDisplayedNumber] = useState(number)
  const [previousNumber, setPreviousNumber] = useState(number)
  /**
   * @type {[Tweenable | undefined, React.Dispatch<React.SetStateAction<Tweenable | undefined>>]}
   */
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
          setDisplayedNumber(Number(number))
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
