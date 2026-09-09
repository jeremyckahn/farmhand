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
