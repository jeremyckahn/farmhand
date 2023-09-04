/**
 * @param {{
 *   experience?: number,
 * }} props
 * @returns {number}
 */
export function levelAchieved({ experience = 0 }) {
  return Math.floor(Math.sqrt(experience) / 10) + 1
}
