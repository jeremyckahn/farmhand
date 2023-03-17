import { random } from '../common/utils'

// TODO: Migrate this to src/common/services/randomNumber.js
// @see https://github.com/jeremyckahn/farmhand/issues/400
/**
 * Compares given number against a randomly generated number
 * @param {number} chance float between 0-1 to compare dice roll against
 * @returns {bool} true if the dice roll was equal to or lower than the given chance, false otherwise
 */
export default function isRandomNumberLessThan(chance) {
  return random() <= chance
}
