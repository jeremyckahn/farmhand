// Pixel font faces.
//
// These are declared here rather than by importing the @fontsource CSS so
// that each face can set `size-adjust`. The pixel fonts have much smaller
// glyphs per em than the fonts they replace (Francois One and Public Sans),
// so without it every heading and paragraph in the app would need its
// font-size tweaked. The adjustments below match each pixel font's cap
// height to that of the font it replaces.

import jersey10Latin from '@fontsource/jersey-10/files/jersey-10-latin-400-normal.woff2'
import jersey10LatinExt from '@fontsource/jersey-10/files/jersey-10-latin-ext-400-normal.woff2'
import pixelifySansLatin400 from '@fontsource/pixelify-sans/files/pixelify-sans-latin-400-normal.woff2'
import pixelifySansLatin700 from '@fontsource/pixelify-sans/files/pixelify-sans-latin-700-normal.woff2'
import pixelifySansLatinExt400 from '@fontsource/pixelify-sans/files/pixelify-sans-latin-ext-400-normal.woff2'
import pixelifySansLatinExt700 from '@fontsource/pixelify-sans/files/pixelify-sans-latin-ext-700-normal.woff2'

// Copied from the @fontsource CSS.
const unicodeRanges = {
  latin:
    'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD',
  latinExt:
    'U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF',
}

const fontFace = (
  family: string,
  weight: number,
  sizeAdjust: string,
  url: string,
  unicodeRange: string
) => ({
  // Quoted because unquoted family names can't contain a word that starts
  // with a digit, like "Jersey 10".
  fontFamily: `"${family}"`,
  fontStyle: 'normal',
  fontDisplay: 'swap',
  fontWeight: weight,
  sizeAdjust,
  src: `url("${url}") format('woff2')`,
  unicodeRange,
})

const DISPLAY_SIZE_ADJUST = '140%'
const BODY_SIZE_ADJUST = '112%'

export const fontFaces = [
  fontFace(
    'Jersey 10',
    400,
    DISPLAY_SIZE_ADJUST,
    jersey10Latin,
    unicodeRanges.latin
  ),
  fontFace(
    'Jersey 10',
    400,
    DISPLAY_SIZE_ADJUST,
    jersey10LatinExt,
    unicodeRanges.latinExt
  ),
  fontFace(
    'Pixelify Sans',
    400,
    BODY_SIZE_ADJUST,
    pixelifySansLatin400,
    unicodeRanges.latin
  ),
  fontFace(
    'Pixelify Sans',
    400,
    BODY_SIZE_ADJUST,
    pixelifySansLatinExt400,
    unicodeRanges.latinExt
  ),
  fontFace(
    'Pixelify Sans',
    700,
    BODY_SIZE_ADJUST,
    pixelifySansLatin700,
    unicodeRanges.latin
  ),
  fontFace(
    'Pixelify Sans',
    700,
    BODY_SIZE_ADJUST,
    pixelifySansLatinExt700,
    unicodeRanges.latinExt
  ),
]
