/**
 * @param {number} [experience]
 * @returns {number}
 */
export function levelAchieved(experience = 0) {
  return Math.floor(Math.sqrt(experience) / 10) + 1
}
