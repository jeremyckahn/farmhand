import React, { useState, useEffect } from 'react'
import { number } from 'prop-types'
import { interpolate, tween } from 'shifty'

import { Div, P } from '../Elements/index.js'

const incompleteColor = '#ff9f00'
const completeColor = '#00e500'

const ProgressBar = ({ percent }: { percent: number }) => {
  const [displayedProgress, setDisplayedProgress] = useState(0)
  const [displayedColor, setDisplayedColor] = useState(incompleteColor)
  const [currentTweenable, setCurrentTweenable]: [
    any | undefined,
    React.Dispatch<React.SetStateAction<any | undefined>>
  ] = useState<any | undefined>()

  useEffect(() => {
    if (!currentTweenable) {
      const tweenable = tween({
        delay: 750,
        easing: 'easeInOutQuad',
        duration: 1500,
        from: { currentPercent: 0 },
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

      setCurrentTweenable(tweenable)
    }

    return () => {
      if (currentTweenable) {
        currentTweenable.cancel()
      }
    }
  }, [currentTweenable, percent])

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
