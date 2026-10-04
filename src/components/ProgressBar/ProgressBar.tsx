import React, { useState, useEffect, useRef } from 'react'
import { interpolate, tween } from 'shifty'

import { Div, P } from '../Elements/index.js'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion.js'
import { pixelBevel, pixelFrameSx, px } from '../../styles/pixel.js'
import { colors } from '../../styles/tokens.js'

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
    <Div
      className="ProgressBar"
      sx={{
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5em',
      }}
    >
      <Div
        className="progress-wrapper"
        sx={{
          flexGrow: 1,
          ...pixelFrameSx({ outline: colors.neutralOutline }),
          height: `calc(1em + ${px(2)})`,
          backgroundColor: 'rgba(0, 0, 0, 0.15)',
          boxShadow: pixelBevel({
            highlight: 'rgba(0, 0, 0, 0.15)',
            lowlight: 'rgba(255, 255, 255, 0.2)',
          }),
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
      <P sx={{ lineHeight: '1em', minWidth: '3em', textAlign: 'right' }}>
        <span>{displayedProgress}%</span>
      </P>
    </Div>
  )
}

export default ProgressBar
