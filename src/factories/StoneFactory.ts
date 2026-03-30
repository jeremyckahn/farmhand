import { randomNumberService } from '../common/services/randomNumber.ts'
import { Factory } from '../interfaces/Factory.ts'
import { coal, saltRock, stone } from '../data/ores/index.ts'
import {
  COAL_SPAWN_CHANCE,
  SALT_ROCK_SPAWN_CHANCE,
  STONE_SPAWN_CHANCE,
} from '../constants.ts'

const spawnableResources = [
  { resource: stone, spawnChance: STONE_SPAWN_CHANCE },
  { resource: saltRock, spawnChance: SALT_ROCK_SPAWN_CHANCE },
  { resource: coal, spawnChance: COAL_SPAWN_CHANCE },
]

/**
 * Resource factory used for spawning stone
 * @constructor
 */
export default class StoneFactory extends Factory {
  /**
   * Generate resources
   * @returns {Array.<farmhand.item>} an array of stone and coal resources
   */
  generate() {
    let resources = []

    for (const { resource, spawnChance } of spawnableResources) {
      if (randomNumberService.isRandomNumberLessThan(spawnChance)) {
        // @ts-expect-error
        resources.push(resource)
      }
    }

    return resources
  }
}
