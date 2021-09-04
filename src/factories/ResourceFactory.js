import { itemType } from '../enums'
import {
  RESOURCE_SPAWN_CHANCE,
  ORE_SPAWN_CHANCE,
  COAL_SPAWN_CHANCE,
  STONE_SPAWN_CHANCE,
} from '../constants'
import { randomChoice } from '../common/utils'

import OreFactory from './OreFactory'
import CoalFactory from './CoalFactory'
import StoneFactory from './StoneFactory'

export default class ResourceFactory {
  static _factoryInstances = {}
  static _instance = null

  static instance() {
    if (!ResourceFactory._instance) {
      ResourceFactory._instance = new ResourceFactory()
    }

    return ResourceFactory._instance
  }

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

  static getFactoryForItemType = type => {
    if (!ResourceFactory._factoryInstances[type]) {
      ResourceFactory._factoryInstances[
        type
      ] = ResourceFactory.generateFactoryInstance(type)
    }

    return ResourceFactory._factoryInstances[type]
  }

  static spawnItem(typeToSpawn) {
    let factory = ResourceFactory.getFactoryForItemType(typeToSpawn)

    if (!factory) return null

    return factory.spawn()
  }

  constructor() {
    this.resourceOptions = [
      { weight: ORE_SPAWN_CHANCE, name: itemType.ORE },
      { weight: COAL_SPAWN_CHANCE, name: itemType.FUEL },
      { weight: STONE_SPAWN_CHANCE, name: itemType.STONE },
    ]
  }

  generateResources() {
    let diceRoll = Math.random()

    if (diceRoll > RESOURCE_SPAWN_CHANCE) {
      return null
    }

    const opt = randomChoice(this.resourceOptions)
    const factory = ResourceFactory.getFactoryForItemType(opt.name)

    if (factory) {
      return factory.generate()
    }

    return null
  }
}
