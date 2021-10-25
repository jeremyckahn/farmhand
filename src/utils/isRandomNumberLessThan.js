/**
 * Compares given number against a randomly generated number
 * @param {number} chance float between 0-1 to compare dice roll against
 * @returns {bool} true if the dice roll was equal to or lower than the given chance, false otherwise
 */
export default function isRandomNumberLessThan(chance) {
  return Math.random() <= chance
}
