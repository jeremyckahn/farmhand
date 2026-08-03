import React, { memo } from 'react'
import { object } from 'prop-types'
import Tooltip from '@mui/material/Tooltip/index.js'

import { COW_COLOR_NAMES } from '../../../strings.js'
import { Li, Ul } from '../../Elements/index.js'
import { colors } from '../../../styles/tokens.js'

const dotSize = '1.25em'

const Bloodline = ({
  colorsInBloodline,
}: {
  colorsInBloodline: Partial<Record<farmhand.cowColors, boolean>>
}) => (
  <Ul className="Bloodline" sx={{ display: 'flex', gap: '0.5em', margin: '1em 0' }}>
    {Object.keys(colorsInBloodline)
      .sort()
      .map(color => (
        <Tooltip
          {...{
            key: color,
            arrow: true,
            placement: 'top',
            title: COW_COLOR_NAMES[color as keyof typeof COW_COLOR_NAMES],
          }}
        >
          <Li
            className={color.toLowerCase()}
            sx={{
              background:
                colors.cow[color.toLowerCase() as keyof typeof colors.cow],
              borderRadius: '50%',
              border: 'solid 1px #000',
              height: dotSize,
              width: dotSize,
              marginBottom: 0,
              marginTop: 0,
            }}
          />
        </Tooltip>
      ))}
  </Ul>
)

Bloodline.propTypes = {
  colorsInBloodline: object.isRequired,
}

export default memo(Bloodline)
