import React, { useEffect, useRef } from 'react'
import classNames from 'classnames'
import { array, arrayOf, string } from 'prop-types'

import FarmhandContext from '../Farmhand/Farmhand.context.tsx'
import Field from '../Field/index.ts'
import { Forest } from '../Forest/index.ts'
import Home from '../Home/index.ts'
import CowPen from '../CowPen/index.ts'
import Shop from '../Shop/index.ts'
import Workshop from '../Workshop/index.ts'
import { Cellar } from '../Cellar/index.ts'
import { stageFocusType } from '../../enums.ts'
import { isOctober, isDecember } from '../../utils/index.tsx'

import './Stage.sass'

export const Stage = ({ field, stageFocus, viewTitle }) => {
  const ref = /** @type {React.MutableRefObject<HTMLDivElement | null>} */ useRef(
    null
  )

  useEffect(() => {
    if (ref.current) {
      const current = /** @type {HTMLElement} */ ref.current
      const { style } = current
      // Set scroll position to the top
      // @ts-expect-error
      current.scrollTop = 0

      // Stop any intertial scrolling
      // @ts-expect-error
      style.overflow = 'hidden'
      // @ts-expect-error
      setTimeout(() => (style.overflow = ''), 0)
    }
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
