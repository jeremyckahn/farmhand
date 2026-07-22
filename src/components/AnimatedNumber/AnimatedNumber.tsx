import React, { useEffect, useRef, useState } from 'react'
// eslint-disable-next-line no-unused-vars
import { tween, Tweenable } from 'shifty'
import { func as funcProp, number as numberProp } from 'prop-types'

import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion.js'

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
  const prefersReducedMotion = usePrefersReducedMotion()
  const [displayedNumber, setDisplayedNumber] = useState(number)
  const previousNumberRef = useRef(number)
  const tweenableRef = useRef<Tweenable | null>(null)

  useEffect(() => {
    if (prefersReducedMotion) {
      if (tweenableRef.current) {
        tweenableRef.current.cancel()
        tweenableRef.current = null
      }

      previousNumberRef.current = number
      setDisplayedNumber(number)
      return
    }

    if (previousNumberRef.current !== number) {
      if (tweenableRef.current) {
        tweenableRef.current.cancel()
      }

      const tweenable = tween({
        easing: 'easeOutQuad',
        duration: 750,
        render: ({ number: tweenedNumber }: any) => {
          setDisplayedNumber(Number(tweenedNumber))
        },
        from: {
          number: previousNumberRef.current,
        },
        to: { number },
      })

      tweenableRef.current = tweenable
      previousNumberRef.current = number
    }

    return () => {
      if (tweenableRef.current) {
        tweenableRef.current.cancel()
        tweenableRef.current = null
      }
    }
  }, [number, prefersReducedMotion])

  const valueToDisplay = prefersReducedMotion ? number : displayedNumber

  return <span className="AnimatedNumber">{formatter(valueToDisplay)}</span>
}

AnimatedNumber.propTypes = {
  formatter: funcProp,
  number: numberProp.isRequired,
}

export default AnimatedNumber
