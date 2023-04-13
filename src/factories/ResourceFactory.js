import { itemType, toolLevel } from '../enums'
import {
  RESOURCE_SPAWN_CHANCE,
  ORE_SPAWN_CHANCE,
  COAL_SPAWN_CHANCE,
  STONE_SPAWN_CHANCE,
} from '../constants'
import { randomChoice } from '../utils'

import { randomNumberService } from '../common/services/randomNumber'

import OreFactory from './OreFactory'
import CoalFactory from './CoalFactory'
import StoneFactory from './StoneFactory'

/**
 * Used for spawning mined resources
 * @constructor
 */
export default class ResourceFactory {
  constructor() {
    this.resourceOptions = [
      { weight: ORE_SPAWN_CHANCE, itemType: itemType.ORE },
      { weight: COAL_SPAWN_CHANCE, itemType: itemType.FUEL },
      { weight: STONE_SPAWN_CHANCE, itemType: itemType.STONE },
    ]
  }

  /**
   * Object for internal cache of factory instances
   * @static
   */
  static _factoryInstances = {}

  /**
   * Var for caching reference to instance of ResourceFactory
   * @static
   */
  static _instance = null

  /**
   * Retrieve a reusable instance of ResourceFactory
   * @returns {ResourceFactory}
   * @static
   */
  static instance() {
    if (!ResourceFactory._instance) {
      ResourceFactory._instance = new ResourceFactory()
    }

    return ResourceFactory._instance
  }

  /**
   * Generate an instance for specific factory
   * @param {Number} type - an item type from itemType enum
   * @returns {?Factory} returns a factory if one exists for type, default return is null
   * @static
   */
  static generateFactoryInstance(type) {
    switch (type) {
      case itemType.STONE:
        return new StoneFactory()

      case itemType.FUEL:
        return new CoalFactory()

      case itemType.ORE:
        return new OreFactory()

      default:
        return null
    }
  }

  /**
   * Retrieve a specific factory for generating resources. Will create and cache
   * a factory instance for reuse.
   * @param {Number} type - an item type from itemType enum
   * @return {Factory}
   * @static
   */
  static getFactoryForItemType = type => {
    if (!ResourceFactory._factoryInstances[type]) {
      ResourceFactory._factoryInstances[
        type
      ] = ResourceFactory.generateFactoryInstance(type)
    }

    return ResourceFactory._factoryInstances[type]
  }

  /**
   * Use dice roll and resource factories to generate resources at random
   * @returns {Array} array of resource objects
   */
  generateResources(shovelLevel) {
    let resources = []
    let spawnChance = RESOURCE_SPAWN_CHANCE

    switch (shovelLevel) {
      case toolLevel.BRONZE:
        spawnChance += 0.1
        break

      case toolLevel.IRON:
        spawnChance += 0.2
        break

      case toolLevel.SILVER:
        spawnChance += 0.3
        break

      case toolLevel.GOLD:
        spawnChance += 0.5
        break

      default:
    }

    if (randomNumberService.isRandomNumberLessThan(spawnChance)) {
      const opt = randomChoice(this.resourceOptions)
      const factory = ResourceFactory.getFactoryForItemType(opt.itemType)

      if (factory) {
        resources = factory.generate()
      }
    }

    return resources
  }
}
