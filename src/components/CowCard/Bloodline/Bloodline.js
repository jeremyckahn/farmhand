import React, { memo } from 'react'
import { object } from 'prop-types'
import Tooltip from '@mui/material/Tooltip'

import { COW_COLOR_NAMES } from '../../../strings'

import './Bloodline.sass'

const Bloodline = ({ colorsInBloodline }) => (
  <ul {...{ className: 'Bloodline' }}>
    {Object.keys(colorsInBloodline)
      .sort()
      .map(color => (
        <Tooltip
          {...{
            key: color,
            arrow: true,
            placement: 'top',
            title: COW_COLOR_NAMES[color],
          }}
        >
          <li {...{ className: color.toLowerCase() }} />
        </Tooltip>
      ))}
  </ul>
)

Bloodline.propTypes = {
  colorsInBloodline: object.isRequired,
}

export default memo(Bloodline)
