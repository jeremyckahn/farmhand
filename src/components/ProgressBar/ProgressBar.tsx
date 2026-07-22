import React, { useState, useEffect, useRef } from 'react'
import { number } from 'prop-types'
import { interpolate, tween } from 'shifty'

import { Div, P } from '../Elements/index.js'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion.js'

const incompleteColor = '#ff9f00'
const completeColor = '#00e500'

const ProgressBar = ({ percent }: { percent: number }) => {
  const prefersReducedMotion = usePrefersReducedMotion()
  const [displayedProgress, setDisplayedProgress] = useState(
    prefersReducedMotion ? percent : 0
  )
  const [displayedColor, setDisplayedColor] = useState(
    prefersReducedMotion
      ? interpolate(
          { color: incompleteColor },
          { color: completeColor },
          percent / 100
        ).color
      : incompleteColor
  )
  const tweenableRef = useRef<any | null>(null)
  const previousPercentRef = useRef(prefersReducedMotion ? percent : 0)

  useEffect(() => {
    const finalColor = interpolate(
      { color: incompleteColor },
      { color: completeColor },
      percent / 100
    ).color

    if (prefersReducedMotion) {
      setDisplayedProgress(percent)
      setDisplayedColor(finalColor)
      previousPercentRef.current = percent

      if (tweenableRef.current) {
        tweenableRef.current.cancel()
        tweenableRef.current = null
      }

      return
    }

    if (!tweenableRef.current) {
      const tweenable = tween({
        delay: 750,
        easing: 'easeInOutQuad',
        duration: 1500,
        from: { currentPercent: previousPercentRef.current },
        to: { currentPercent: percent },
        render: ({ currentPercent }: any) => {
          const currentPercentNumber = Number(currentPercent)

          setDisplayedProgress(Number(currentPercentNumber.toFixed(2)))
          setDisplayedColor(
            interpolate(
              { color: incompleteColor },
              { color: completeColor },
              currentPercentNumber / 100
            ).color
          )
        },
      })

      tweenableRef.current = tweenable
      previousPercentRef.current = percent
    }

    return () => {
      if (tweenableRef.current) {
        tweenableRef.current.cancel()
        tweenableRef.current = null
      }
    }
  }, [percent, prefersReducedMotion])

  return (
    <Div className="ProgressBar" sx={{ margin: '0 auto' }}>
      <Div
        className="progress-wrapper"
        sx={{
          height: '1em',
          background: '#ddd',
          borderRadius: '0.5em',
          overflow: 'hidden',
        }}
      >
        <Div
          {...{
            className: 'progress',
            style: {
              background: displayedColor,
              width: `${displayedProgress}%`,
            },
          }}
          sx={{ height: '100%' }}
        ></Div>
      </Div>
      <P sx={{ lineHeight: '2em', textAlign: 'center' }}>
        <span>{displayedProgress}%</span>
      </P>
    </Div>
  )
}

ProgressBar.propTypes = {
  percent: number.isRequired,
}

export default ProgressBar
