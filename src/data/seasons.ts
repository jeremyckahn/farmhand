import { season } from '../enums.js'

export const SEASON_ORDER: season[] = [
  season.SPRING,
  season.SUMMER,
  season.FALL,
  season.WINTER,
]

export const seasonNameMap: Record<season, string> = {
  [season.SPRING]: 'Spring',
  [season.SUMMER]: 'Summer',
  [season.FALL]: 'Fall',
  [season.WINTER]: 'Winter',
}

// A CSS `filter` value per season, applied to the Field, Cow Pen, and Forest
// screens (see Stage.tsx) to give each season a distinct visual tone. Spring
// is intentionally untinted. These are a first pass and expected to need
// tuning to get the right feel.
//
// Summer/Fall lead with a strong `sepia()` before `hue-rotate()`. A
// hue-rotate alone rotates every source color around the color wheel by the
// same amount, so on multi-hue pixel art it scatters unpredictably (e.g. a
// 180deg rotation sends green to its complement, magenta, not blue).
// Sepia-ing heavily first collapses the image into a narrow brown/tan hue
// band, so the subsequent rotate lands everything in roughly the same place
// instead - that's what makes the tint read as one consistent color rather
// than a handful of wrongly-recolored elements.
export const seasonFilterMap: Record<season, string> = {
  [season.SPRING]: 'none',
  [season.SUMMER]:
    'sepia(0.26) hue-rotate(-10deg) saturate(1.91) brightness(0.93) contrast(1.47)',
  [season.FALL]:
    'sepia(0.13) hue-rotate(-38deg) saturate(1.34) brightness(0.97) contrast(1)',
  [season.WINTER]:
    'sepia(0.59) hue-rotate(129deg) saturate(0.98) brightness(0.93) contrast(1.02)',
}
