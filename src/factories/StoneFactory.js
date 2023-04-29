/** @typedef {import("../index").farmhand.item} farmhand.item */
import { randomNumberService } from '../common/services/randomNumber'
import { Factory } from '../interfaces/Factory'
import { coal, saltRock, stone } from '../data/ores'
import {
  COAL_SPAWN_CHANCE,
  SALT_ROCK_SPAWN_CHANCE,
  STONE_SPAWN_CHANCE,
} from '../constants'

const spawnableResources = [
  [stone, STONE_SPAWN_CHANCE],
  [saltRock, SALT_ROCK_SPAWN_CHANCE],
  [coal, COAL_SPAWN_CHANCE],
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

    for (const [resource, spawnChance] of spawnableResources) {
      if (randomNumberService.isRandomNumberLessThan(spawnChance)) {
        resources.push(resource)
      }
    }

    return resources
  }
}
