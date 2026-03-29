import React, { useEffect, useState } from 'react'
// eslint-disable-next-line no-unused-vars
import { tween, Tweenable } from 'shifty'
import { func as funcProp, number as numberProp } from 'prop-types'

const defaultFormatter = (/** @type {number} */ num) => `${num}`

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
        // @ts-expect-error
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

      // @ts-expect-error
      setCurrentTweenable(tweenable)
    }

    return () => {
      if (currentTweenable) {
        // @ts-expect-error
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
