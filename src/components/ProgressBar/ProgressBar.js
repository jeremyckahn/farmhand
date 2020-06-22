import React from 'react'
import { number } from 'prop-types'

import './ProgressBar.sass'

const ProgressBar = ({
  percent,
  fixedPercent = Number(percent.toFixed(2)),
}) => (
  <div className="ProgressBar">
    <div {...{ className: 'progress-wrapper' }}>
      <div
        {...{
          className: 'progress',
          style: { width: `${fixedPercent}%` },
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
