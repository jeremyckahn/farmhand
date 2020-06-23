import React from 'react'
import { number } from 'prop-types'
import { interpolate } from 'shifty'

import './ProgressBar.sass'

const incompleteColor = '#ff9f00'
const completeColor = '#00e500'

const ProgressBar = ({
  percent,
  fixedPercent = Number(percent.toFixed(2)),
}) => (
  <div className="ProgressBar">
    <div {...{ className: 'progress-wrapper' }}>
      <div
        {...{
          className: 'progress',
          style: {
            background: interpolate(
              { color: incompleteColor },
              { color: completeColor },
              percent / 100
            ).color,
            width: `${fixedPercent}%`,
          },
        }}
      ></div>
    </div>
    <p>
      <span>{fixedPercent}%</span>
    </p>
  </div>
)

ProgressBar.propTypes = {
  percent: number.isRequired,
}

export default ProgressBar
