import React from 'react'
import useWindowSize from 'react-use/lib/useWindowSize.js'
import Confetti from 'react-confetti'

import { random } from '../../common/utils.js'

const randomInt = (min, max) => {
  return Math.floor(min + random() * (max - min + 1))
}

// Taken from:
// https://github.com/alampros/react-confetti/blob/484bad0a0aaddbcfcc2fb4c1a4a7eeceaa6d4879/stories/snow.story.jsx#L7-L24
const drawSnowflake = function(ctx) {
  const numPoints = this.numPoints || randomInt(3, 4) * 2
  this.numPoints = numPoints
  const innerRadius = this.radius * 0.2
  const outerRadius = this.radius * 0.8
  ctx.beginPath()
  ctx.moveTo(0, 0 - outerRadius)

  for (let n = 1; n < numPoints * 2; n++) {
    const radius = n % 2 === 0 ? outerRadius : innerRadius
    const x = radius * Math.sin((n * Math.PI) / numPoints)
    const y = -1 * radius * Math.cos((n * Math.PI) / numPoints)
    ctx.lineTo(x, y)
  }
  ctx.fill()
  ctx.stroke()
  ctx.closePath()
}

export const SnowBackground = () => {
  const { width, height } = useWindowSize()
  return (
    <Confetti
      style={{ position: 'fixed' }}
      width={width}
      height={height}
      drawShape={drawSnowflake}
      colors={['#FFFFFF', '#CBDDF8']}
      gravity={0.03}
      numberOfPieces={10}
      wind={0.01}
    />
  )
}
