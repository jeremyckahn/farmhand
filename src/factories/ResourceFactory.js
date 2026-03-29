import { itemType, toolLevel } from '../enums.js'
import {
  RESOURCE_SPAWN_CHANCE,
  ORE_SPAWN_CHANCE,
  COAL_SPAWN_CHANCE,
  STONE_SPAWN_CHANCE,
} from '../constants.js'
import { randomChoice } from '../utils/index.js'
import { randomNumberService } from '../common/services/randomNumber.js'
// eslint-disable-next-line no-unused-vars
import { Factory } from '../interfaces/Factory.js'

import OreFactory from './OreFactory.js'
import CoalFactory from './CoalFactory.js'
import StoneFactory from './StoneFactory.js'

/**
 * Object for private cache of factory instances
 * @type {Record.<string, Factory | null>}
 */
const factoryInstances = {}

/**
 * Var for caching reference to instance of ResourceFactory
 * @type {?ResourceFactory}
 */
let instance = null

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
   * Retrieve a reusable instance of ResourceFactory
   * @returns {ResourceFactory}
   * @static
   */
  static instance() {
    if (!instance) {
      instance = new ResourceFactory()
    }

    return instance
  }

  /**
   * Generate an instance for specific factory
   * @param {farmhand.itemType} type
   * @returns {?Factory} A factory if one exists for type, default return is null
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
   * @returns {?Factory}
   */
  static getFactoryForItemType = type => {
    if (!factoryInstances[type]) {
      factoryInstances[type] = ResourceFactory.generateFactoryInstance(type)
    }

    return factoryInstances[type]
  }

  /**
   * Use dice roll and resource factories to generate resources at random
   * @returns {Array.<farmhand.item>} array of resource objects
   */
  generateResources(shovelLevel) {
    /** @type {Array.<farmhand.item>} */
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
        const generated = factory.generate()
        resources = Array.isArray(generated) ? generated : [generated]
      }
    }

    return resources
  }
}
