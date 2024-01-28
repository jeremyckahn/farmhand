import React, { useContext } from 'react'

import FarmhandContext from '../Farmhand/Farmhand.context'

import './Forest.sass'

export const Forest = () => {
  const {
    gameState: { forest },
  } = useContext(FarmhandContext)

  return (
    <div className="Forest">
      <div className="forest-plots">
        {forest.map((row, y) =>
          row.map((_col, x) => (
            <div className="forest-plot">{`${x}, ${y}`}</div>
          ))
        )}
      </div>
    </div>
  )
}
