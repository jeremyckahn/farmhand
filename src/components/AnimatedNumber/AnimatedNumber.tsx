import React, { useEffect, useState } from 'react'
// eslint-disable-next-line no-unused-vars
import { tween, Tweenable } from 'shifty'
import { func as funcProp, number as numberProp } from 'prop-types'

const defaultFormatter = (num: number) => `${num}`

/**
 * AnimatedNumber component that displays a number with an animation effect.
 */
const AnimatedNumber = ({
  number,
  formatter = defaultFormatter,
}: {
  number: number
  formatter?: typeof defaultFormatter
}): JSX.Element => {
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
