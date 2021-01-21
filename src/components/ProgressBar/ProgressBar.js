import React, { useState, useEffect } from 'react'
import { number } from 'prop-types'
import { interpolate, tween } from 'shifty'

import './ProgressBar.sass'

const incompleteColor = '#ff9f00'
const completeColor = '#00e500'

const ProgressBar = ({ percent }) => {
  const [displayedProgress, setDisplayedProgress] = useState(0)
  const [displayedColor, setDisplayedColor] = useState(incompleteColor)
  const [currentTweenable, setCurrentTweenable] = useState()

  useEffect(() => {
    if (!currentTweenable) {
      const tweenable = tween({
        delay: 750,
        easing: 'easeInOutQuad',
        duration: 1500,
        from: { currentPercent: 0 },
        to: { currentPercent: percent },
        render: ({ currentPercent }) => {
          setDisplayedProgress(currentPercent.toFixed(2))
          setDisplayedColor(
            interpolate(
              { color: incompleteColor },
              { color: completeColor },
              currentPercent / 100
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
    <div className="ProgressBar">
      <div {...{ className: 'progress-wrapper' }}>
        <div
          {...{
            className: 'progress',
            style: {
              background: displayedColor,
              width: `${displayedProgress}%`,
            },
          }}
        ></div>
      </div>
      <p>
        <span>{displayedProgress}%</span>
      </p>
    </div>
  )
}

ProgressBar.propTypes = {
  percent: number.isRequired,
}

export default ProgressBar
