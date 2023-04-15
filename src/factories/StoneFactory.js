/** @typedef {import("../index").farmhand.item} farmhand.item */
import { coal, saltRock, stone } from '../data/ores'
import {
  COAL_SPAWN_CHANCE,
  SALT_ROCK_SPAWN_CHANCE,
  STONE_SPAWN_CHANCE,
} from '../constants'
import { randomNumberService } from '../common/services/randomNumber'

/**
 * Resource factory used for spawning stone
 * @constructor
 */
export default class StoneFactory {
  /**
   * Generate resources
   * @returns {Array.<farmhand.item>} an array of stone and coal resources
   */
  generate() {
    let resources = []

    if (randomNumberService.isRandomNumberLessThan(STONE_SPAWN_CHANCE)) {
      resources.push(this.spawnStone())
    }

    if (randomNumberService.isRandomNumberLessThan(SALT_ROCK_SPAWN_CHANCE)) {
      resources.push(this.spawnSaltRock())
    }

    if (randomNumberService.isRandomNumberLessThan(COAL_SPAWN_CHANCE)) {
      resources.push(this.spawnCoal())
    }

    return resources
  }

  /**
   * Spawn a piece of stone
   * @returns {farmhand.module:items.stone} Stone item
   * @private
   */
  spawnStone() {
    return stone
  }

  /**
   * Spawn a piece of stone
   * @returns {farmhand.module:items.saltRock} Salt Rock item
   * @private
   */
  spawnSaltRock() {
    return saltRock
  }

  /**
   * Spawn a piece of coal
   * @returns {farmhand.module:items.coal} Coal item
   * @private
   */
  spawnCoal() {
    return coal
  }
}
