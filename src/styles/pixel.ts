// Retro pixel art UI chrome built on CSS 9-slice scaling (`border-image`).
//
// Each frame is a tiny SVG "sprite" (a few pixels square) that the browser
// slices into corners, edges and a center. Corners are drawn at a fixed
// size and edges stretch, so a frame scales to any element size while every
// art pixel stays exactly PIXEL_SIZE CSS pixels. Because the sprites are
// generated as SVGs, their colors can be derived from the MUI palette at
// runtime instead of needing a hand-drawn PNG per color.
//
// Only the outline, the notched corners and the hard drop shadow live in
// the 9-slice image. The element's background is clipped to its padding box
// so it fills the frame's interior, and the bevel highlight is drawn with
// inset box-shadows. That keeps `backgroundColor` overrides (hover states,
// selected cards, palette colors, etc.) working without regenerating any
// images.

/**
 * The size, in CSS pixels, of one "art pixel" in the UI chrome.
 */
export const PIXEL_SIZE = 3

/**
 * Converts a number of art pixels into a CSS length.
 */
export const px = (units: number) => `${units * PIXEL_SIZE}px`

/**
 * Converts a pixel map into a CSS `url()` for an SVG data URI. Each string in
 * `rows` is one row of pixels, and each character is a key of `palette`. A
 * `.` is a transparent pixel.
 */
export const pixelArtUrl = (
  rows: string[],
  palette: Record<string, string>
): string => {
  const height = rows.length
  const width = rows[0].length
  let rects = ''

  rows.forEach((row, y) => {
    ;[...row].forEach((char, x) => {
      const fill = palette[char]

      if (char === '.' || !fill) return

      rects += `<rect x="${x}" y="${y}" width="1" height="1" fill="${fill}"/>`
    })
  })

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" shape-rendering="crispEdges">${rects}</svg>`

  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`
}

// O = outline, D = drop shadow
//
// A 1px notch in each corner gives the classic pixel art "rounded" box. The
// center pixel is left transparent; the element's own background shows
// through it.
const FRAME = ['.O.', 'O.O', '.O.']
const FRAME_SLICE = '1'
const FRAME_WIDTH = px(1)

// Same as FRAME, plus a hard drop shadow offset by one art pixel to the
// bottom right. The right and bottom slices are two pixels wide to hold the
// shadow.
const SHADOWED_FRAME = ['.O..', 'O.OD', '.ODD', '.DD.']
const SHADOWED_FRAME_SLICE = '1 2 2 1'
const SHADOWED_FRAME_WIDTH = `${px(1)} ${px(2)} ${px(2)} ${px(1)}`

export const pixelShadowColor = 'rgba(0, 0, 0, 0.3)'

export interface PixelFrameOptions {
  /**
   * The outline color.
   */
  outline: string
  /**
   * Whether to render a hard drop shadow. When this is `'pressed'`, space
   * for the shadow is preserved (so the element's size doesn't change) but
   * the shadow itself is not drawn. Pair that with `pixelPressedSx`.
   */
  shadow?: boolean | 'pressed'
}

/**
 * Returns sx styles that render a scalable 9-slice pixel art frame around an
 * element.
 */
export const pixelFrameSx = ({
  outline,
  shadow = false,
}: PixelFrameOptions) => {
  const rows = shadow ? SHADOWED_FRAME : FRAME
  const slice = shadow ? SHADOWED_FRAME_SLICE : FRAME_SLICE
  const width = shadow ? SHADOWED_FRAME_WIDTH : FRAME_WIDTH
  const image = pixelArtUrl(rows, {
    O: outline,
    D: shadow === true ? pixelShadowColor : 'transparent',
  })

  return {
    borderStyle: 'solid',
    borderColor: 'transparent',
    borderWidth: width,
    borderRadius: 0,
    borderImageSource: image,
    borderImageSlice: slice,
    borderImageWidth: width,
    borderImageRepeat: 'stretch',
    // Keep the background inside the outline so the notched corners and the
    // drop shadow stay transparent.
    backgroundClip: 'padding-box',
  } as const
}

/**
 * Returns a `box-shadow` value that draws a one-art-pixel bevel inside an
 * element: a light edge on the top and left, and a dark edge on the bottom
 * and right.
 */
export const pixelBevel = ({
  highlight = 'rgba(255, 255, 255, 0.45)',
  lowlight = 'rgba(0, 0, 0, 0.12)',
}: { highlight?: string; lowlight?: string } = {}) =>
  `inset ${px(1)} ${px(1)} 0 ${highlight}, inset -${px(1)} -${px(1)} 0 ${lowlight}`

/**
 * Inverted bevel for pressed/active controls.
 */
export const pixelBevelPressed = pixelBevel({
  highlight: 'rgba(0, 0, 0, 0.15)',
  lowlight: 'rgba(255, 255, 255, 0.25)',
})

/**
 * A crisp (unblurred) drop shadow for sprites and other arbitrarily shaped
 * elements.
 */
export const pixelDropShadowFilter = `drop-shadow(${px(1)} ${px(1)} 0 rgba(0, 0, 0, 0.2))`

/**
 * Styles for the pressed state of a control framed with `shadow: true`. The
 * control shifts into the space its shadow occupied, so it appears to be
 * pushed down.
 */
export const pixelPressedSx = (outline: string) => ({
  ...pixelFrameSx({ outline, shadow: 'pressed' }),
  transform: `translate(${px(1)}, ${px(1)})`,
  boxShadow: pixelBevelPressed,
})
