/**
 * Does a dice roll
 * @param {float} chance float between 0-1 to compare dice roll against
 * @returns {bool} true if the dice roll was equal to or lower than the given chance, false otherwise
 */
export default function isRandomChance(chance) {
  return Math.random() <= chance
}
