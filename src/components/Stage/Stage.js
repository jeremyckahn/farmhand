import React, { useEffect, useRef } from 'react'
import classNames from 'classnames'
import { array, arrayOf, string } from 'prop-types'

import FarmhandContext from '../Farmhand/Farmhand.context.js'
import Field from '../Field/index.js'
import { Forest } from '../Forest/index.js'
import Home from '../Home/index.js'
import CowPen from '../CowPen/index.js'
import Shop from '../Shop/index.js'
import Workshop from '../Workshop/index.js'
import { Cellar } from '../Cellar/index.js'
import { stageFocusType } from '../../enums.js'
import { isOctober, isDecember } from '../../utils/index.js'

import './Stage.sass'

export const Stage = ({ field, stageFocus, viewTitle }) => {
  const ref = useRef(null)

  useEffect(() => {
    const {
      current,
      current: { style },
    } = ref
    // Set scroll position to the top
    current.scrollTop = 0

    // Stop any intertial scrolling
    style.overflow = 'hidden'
    setTimeout(() => (style.overflow = ''), 0)
  }, [stageFocus])

  return (
    <div
      {...{
        className: classNames('Stage', {
          'is-october': isOctober(),
          'is-december': isDecember(),
        }),
        'data-stage-focus': stageFocus,
        role: 'main',
        ref,
      }}
    >
      <h2 className="view-title">{viewTitle}</h2>
      {stageFocus === stageFocusType.HOME && <Home />}
      {stageFocus === stageFocusType.FIELD && (
        <Field
          {...{
            columns: field[0].length,
            rows: field.length,
          }}
        />
      )}
      {stageFocus === stageFocusType.FOREST && <Forest />}
      {stageFocus === stageFocusType.SHOP && <Shop />}
      {stageFocus === stageFocusType.COW_PEN && <CowPen />}
      {stageFocus === stageFocusType.WORKSHOP && <Workshop />}
      {stageFocus === stageFocusType.CELLAR && <Cellar />}
      <div {...{ className: 'spacer' }} />
    </div>
  )
}

Stage.propTypes = {
  field: arrayOf(array).isRequired,
  stageFocus: string.isRequired,
  viewTitle: string.isRequired,
}

export default function Consumer(props) {
  return (
    <FarmhandContext.Consumer>
      {({ gameState, handlers }) => (
        <Stage {...{ ...gameState, ...handlers, ...props }} />
      )}
    </FarmhandContext.Consumer>
  )
}
