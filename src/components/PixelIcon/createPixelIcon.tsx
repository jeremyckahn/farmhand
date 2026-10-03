import React from 'react'
import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon/index.js'

// Pixel art icons are authored as small text pixel maps:
//
//   `#` is a solid pixel
//   `+` is a half-tone pixel (the same color at reduced opacity)
//   anything else is transparent
//
// Every pixel map in an icon set should be the same size so icons line up
// with each other.
export type PixelMap = readonly string[]

const SHADE_OPACITY = 0.45

/**
 * Builds an SVG path that covers every pixel in `rows` that matches `char`.
 * Horizontal runs of matching pixels are merged into a single rectangle to
 * keep the path short.
 */
const pixelPath = (rows: PixelMap, char: string) => {
  let d = ''

  rows.forEach((row, y) => {
    let x = 0

    while (x < row.length) {
      if (row[x] !== char) {
        x++
        continue
      }

      const start = x

      while (row[x] === char) x++

      d += `M${start} ${y}h${x - start}v1h${start - x}z`
    }
  })

  return d
}

/**
 * Mirrors a pixel map horizontally.
 */
export const flipX = (rows: PixelMap): PixelMap =>
  rows.map(row => [...row].reverse().join(''))

/**
 * Mirrors a pixel map vertically.
 */
export const flipY = (rows: PixelMap): PixelMap => [...rows].reverse()

/**
 * Rotates a square pixel map 90 degrees clockwise.
 */
export const rotate = (rows: PixelMap): PixelMap =>
  [...rows[0]].map((_, x) =>
    rows
      .map(row => row[x])
      .reverse()
      .join('')
  )

/**
 * Creates an MUI SvgIcon component from a pixel map. The result is a drop-in
 * replacement for an @mui/icons-material icon: it takes the same props, is
 * colored with `currentColor`, and has a `data-testid` of `${name}Icon`.
 */
export const createPixelIcon = (rows: PixelMap, name: string) => {
  const width = rows[0].length
  const height = rows.length
  const solid = pixelPath(rows, '#')
  const shade = pixelPath(rows, '+')

  const PixelIcon = (props: SvgIconProps) => (
    <SvgIcon
      data-testid={`${name}Icon`}
      viewBox={`0 0 ${width} ${height}`}
      shapeRendering="crispEdges"
      {...props}
    >
      {shade && <path d={shade} opacity={SHADE_OPACITY} />}
      <path d={solid} />
    </SvgIcon>
  )

  PixelIcon.displayName = `Pixel${name}Icon`

  return PixelIcon
}
