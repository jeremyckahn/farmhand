/**
 * @module farmhand.recipes
 * @typedef {import('../index').farmhand.item} farmhand.item
 * @typedef {import('../index').farmhand.recipe} farmhand.recipe
 * @typedef {import('../index').farmhand.grape} farmhand.grape
 * @typedef {import('../index').farmhand.wine} farmhand.wine
 */
import { itemType, fieldMode, recipeType } from '../enums.js'
import {
  GRAPES_REQUIRED_FOR_WINE,
  RECIPE_INGREDIENT_VALUE_MULTIPLIER,
} from '../constants.js'
import { getYeastRequiredForWine } from '../utils/getYeastRequiredForWine.js'

import * as items from './items.js'
import baseItemsMap from './items-map.js'
import { grapeVarietyNameMap } from './crops/grape.js'

const itemsMap = { ...baseItemsMap }

/**
 * @param {Omit<farmhand.recipe, 'type' | 'value'> & { type?: string, value?: number }} recipe
 * @returns {farmhand.recipe}
 */
const itemify = recipe => {
  const item = Object.freeze({
    type: itemType.CRAFTED_ITEM,
    value: Object.keys(recipe.ingredients).reduce(
      (sum, itemId) =>
        sum +
        RECIPE_INGREDIENT_VALUE_MULTIPLIER *
          itemsMap[itemId].value *
          recipe.ingredients[itemId],
      0
    ),
    ...recipe,
  })

  itemsMap[recipe.id] = item

  return item
}

/**
 * @property farmhand.module:recipes.salt
 * @type {farmhand.recipe}
 */
export const salt = itemify({
  id: 'salt',
  name: 'Salt',
  ingredients: {
    [items.saltRock.id]: 1,
  },
  condition: state => state.itemsSold[items.saltRock.id] >= 30,
  description: 'Useful for seasoning food and fermentation.',
  recipeType: recipeType.KITCHEN,
})

/**
 * @property farmhand.module:recipes.flour
 * @type {farmhand.recipe}
 */
export const flour = itemify({
  id: 'flour',
  name: 'Flour',
  ingredients: {
    [items.wheat.id]: 10,
  },
  condition: state => state.itemsSold[items.wheat.id] >= 20,
  recipeType: recipeType.KITCHEN,
})

/**
 * @property farmhand.module:recipes.yeast
 * @type {farmhand.recipe}
 */
export const yeast = itemify({
  id: 'yeast',
  name: 'Yeast',
  ingredients: {
    [flour.id]: 5,
  },
  condition: state => state.itemsSold[flour.id] >= 25,
  recipeType: recipeType.KITCHEN,
})

/**
 * @param {farmhand.grape} grape
 * @returns {farmhand.wine}
 */
const getWineRecipeFromGrape = grape => {
  return {
    ...itemify({
      id: grape.wineId,
      name: `${grapeVarietyNameMap[grape.variety]} Wine`,
      type: itemType.CRAFTED_ITEM,
      ingredients: {
        [grape.id]: GRAPES_REQUIRED_FOR_WINE,
        [yeast.id]: getYeastRequiredForWine(grape.variety),
      },
      recipeType: recipeType.WINE,
      // NOTE: This prevents wines from appearing in the Learned Recipes list in the Workshop
      condition: () => false,
    }),
    variety: grape.variety,
  }
}

/**
 * @property farmhand.module:recipes.bread
 * @type {farmhand.recipe}
 */
export const bread = itemify({
  id: 'bread',
  name: 'Bread',
  ingredients: {
    [flour.id]: 10,
    [yeast.id]: 5,
  },
  condition: state =>
    state.itemsSold[flour.id] >= 30 && state.itemsSold[yeast.id] >= 15,
  recipeType: recipeType.KITCHEN,
})

/**
 * @property farmhand.module:recipes.butter
 * @type {farmhand.recipe}
 */
export const butter = itemify({
  id: 'butter',
  name: 'Butter',
  ingredients: {
    [items.milk3.id]: 5,
  },
  condition: state => state.itemsSold[items.milk3.id] >= 30,
  recipeType: recipeType.KITCHEN,
})

/**
 * @property farmhand.module:recipes.sunButter
 * @type {farmhand.recipe}
 */
export const sunButter = itemify({
  id: 'sun-butter',
  name: 'Sun Butter',
  ingredients: {
    [items.sunflower.id]: 25,
  },
  condition: state => state.itemsSold[items.sunflower.id] >= 200,
  recipeType: recipeType.KITCHEN,
})

/*
 * @property farmhand.module:recipes.oliveOil
 * @type {farmhand.recipe}
 */
export const oliveOil = itemify({
  id: 'olive-oil',
  name: 'Olive Oil',
  ingredients: {
    [items.olive.id]: 250,
  },
  condition: state => state.itemsSold[items.olive.id] >= 500,
  recipeType: recipeType.KITCHEN,
})

/**
 * @property farmhand.module:recipes.cheese
 * @type {farmhand.recipe}
 */
export const cheese = itemify({
  id: 'cheese',
  name: 'Cheese',
  ingredients: {
    [items.milk3.id]: 8,
  },
  condition: state => (state.itemsSold[items.milk3.id] || 0) >= 20,
  recipeType: recipeType.KITCHEN,
})

/**
 * @property farmhand.module:recipes.rainbowCheese
 * @type {farmhand.recipe}
 */
export const rainbowCheese = itemify({
  id: 'rainbowCheese',
  name: 'Rainbow Cheese',
  ingredients: {
    [items.rainbowMilk3.id]: 10,
  },
  condition: state => (state.itemsSold[items.rainbowMilk3.id] || 0) >= 30,
  recipeType: recipeType.KITCHEN,
})

/**
 * @property farmhand.module:recipes.chocolate
 * @type {farmhand.recipe}
 */
export const chocolate = itemify({
  id: 'chocolate',
  name: 'Chocolate',
  ingredients: {
    [items.chocolateMilk.id]: 10,
  },
  condition: state => (state.itemsSold[items.chocolateMilk.id] || 0) >= 25,
  recipeType: recipeType.KITCHEN,
})

/**
 * @property farmhand.module:recipes.carrotSoup
 * @type {farmhand.recipe}
 */
export const carrotSoup = itemify({
  id: 'carrot-soup',
  name: 'Carrot Soup',
  ingredients: {
    [items.carrot.id]: 4,
  },
  condition: state => (state.itemsSold[items.carrot.id] || 0) >= 10,
  recipeType: recipeType.KITCHEN,
})

/**
 * @property farmhand.module:recipes.jackolantern
 * @type {farmhand.recipe}
 */
export const jackolantern = itemify({
  id: 'jackolantern',
  name: "Jack-o'-lantern",
  ingredients: {
    [items.pumpkin.id]: 1,
  },
  condition: state => (state.itemsSold[items.pumpkin.id] || 0) >= 50,
  recipeType: recipeType.KITCHEN,
})

/**
 * @property farmhand.module:recipes.spaghetti
 * @type {farmhand.recipe}
 */
export const spaghetti = itemify({
  id: 'spaghetti',
  name: 'Spaghetti',
  ingredients: {
    [items.wheat.id]: 10,
    [items.tomato.id]: 2,
  },
  condition: state =>
    state.itemsSold[items.wheat.id] >= 20 &&
    state.itemsSold[items.tomato.id] >= 5,
  recipeType: recipeType.KITCHEN,
})

/**
 * @property farmhand.module:recipes.frenchOnionSoup
 * @type {farmhand.recipe}
 */
export const frenchOnionSoup = itemify({
  id: 'french-onion-soup',
  name: 'French Onion Soup',
  ingredients: {
    [items.onion.id]: 5,
    [cheese.id]: 2,
    [salt.id]: 2,
  },
  condition: state =>
    state.itemsSold[items.onion.id] >= 15 && state.itemsSold[cheese.id] >= 10,
  recipeType: recipeType.KITCHEN,
})

/**
 * @property farmhand.module:recipes.burger
 * @type {farmhand.recipe}
 */
export const burger = itemify({
  id: 'burger',
  name: 'Burger',
  ingredients: {
    [bread.id]: 1,
    [cheese.id]: 1,
    [items.onion.id]: 1,
    [items.soybean.id]: 12,
    [items.spinach.id]: 1,
    [items.tomato.id]: 1,
  },
  condition: state =>
    state.itemsSold[bread.id] >= 5 &&
    state.itemsSold[cheese.id] >= 5 &&
    state.itemsSold[items.onion.id] >= 5 &&
    state.itemsSold[items.soybean.id] >= 25 &&
    state.itemsSold[items.spinach.id] >= 5 &&
    state.itemsSold[items.tomato.id] >= 5,
  recipeType: recipeType.KITCHEN,
})

/**
 * @property farmhand.module:recipes.summerSalad
 * @type {farmhand.recipe}
 */
export const summerSalad = itemify({
  id: 'summer-salad',
  name: 'Summer Salad',
  ingredients: {
    [items.spinach.id]: 6,
    [items.corn.id]: 1,
    [items.carrot.id]: 1,
  },
  condition: state =>
    state.itemsSold[items.spinach.id] >= 30 &&
    state.itemsSold[items.corn.id] > 5 &&
    state.itemsSold[items.carrot.id] > 5,
  recipeType: recipeType.KITCHEN,
})

/**
 * @property farmhand.module:recipes.soyMilk
 * @type {farmhand.recipe}
 */
export const soyMilk = itemify({
  id: 'soy-milk',
  name: 'Soy Milk',
  ingredients: {
    [items.soybean.id]: 20,
  },
  condition: state => state.itemsSold[items.soybean.id] >= 100,
  recipeType: recipeType.KITCHEN,
})

/**
 * @property farmhand.module:recipes.chocolateSoyMilk
 * @type {farmhand.recipe}
 */
export const chocolateSoyMilk = itemify({
  id: 'chocolate-soy-milk',
  name: 'Chocolate Soy Milk',
  ingredients: {
    [soyMilk.id]: 1,
    [chocolate.id]: 1,
  },
  condition: state =>
    state.itemsSold[soyMilk.id] >= 5 && state.itemsSold[chocolate.id] >= 5,
  recipeType: recipeType.KITCHEN,
})

/**
 * @property farmhand.module:recipes.tofu
 * @type {farmhand.recipe}
 */
export const tofu = itemify({
  id: 'tofu',
  name: 'Tofu',
  ingredients: {
    [soyMilk.id]: 4,
  },
  condition: state => state.itemsSold[soyMilk.id] >= 20,
  recipeType: recipeType.KITCHEN,
})

/**
 * @property farmhand.module:recipes.chicknPotPie
 * @type {farmhand.recipe}
 */
export const chicknPotPie = itemify({
  id: 'chickn-pot-pie',
  name: "Chick'n Pot Pie",
  ingredients: {
    [tofu.id]: 6,
    [items.pea.id]: 10,
    [items.carrot.id]: 8,
    [items.wheat.id]: 12,
    [soyMilk.id]: 3,
  },
  condition: state =>
    state.itemsSold[tofu.id] >= 30 &&
    state.itemsSold[items.pea.id] >= 225 &&
    state.itemsSold[items.carrot.id] >= 300 &&
    state.itemsSold[items.wheat.id] >= 425 &&
    state.itemsSold[soyMilk.id] >= 15,
  recipeType: recipeType.KITCHEN,
})

/**
 * @property farmhand.module:recipes.hotSauce
 * @type {farmhand.recipe}
 */
export const hotSauce = itemify({
  id: 'hot-sauce',
  name: 'Hot Sauce',
  ingredients: {
    [items.jalapeno.id]: 10,
    [salt.id]: 1,
  },
  condition: state => state.itemsSold[items.jalapeno.id] >= 50,
  recipeType: recipeType.KITCHEN,
})

/**
 * @property farmhand.module:recipes.salsa
 * @type {farmhand.recipe}
 */
export const salsa = itemify({
  id: 'salsa',
  name: 'Salsa',
  ingredients: {
    [items.jalapeno.id]: 1,
    [items.onion.id]: 1,
    [items.tomato.id]: 1,
    [items.corn.id]: 1,
  },
  condition: state =>
    state.itemsSold[items.jalapeno.id] >= 5 &&
    state.itemsSold[items.onion.id] >= 5 &&
    state.itemsSold[items.tomato.id] >= 5 &&
    state.itemsSold[items.corn.id] >= 5,
  recipeType: recipeType.KITCHEN,
})

/**
 * @property farmhand.module:recipes.spicyCheese
 * @type {farmhand.recipe}
 */
export const spicyCheese = itemify({
  id: 'spicy-cheese',
  name: 'Spicy Cheese',
  ingredients: {
    [items.jalapeno.id]: 4,
    [items.milk3.id]: 10,
  },
  condition: state =>
    state.itemsSold[items.jalapeno.id] >= 20 &&
    state.itemsSold[items.milk3.id] >= 50,
  recipeType: recipeType.KITCHEN,
})

/**
 * @property farmhand.module:recipes.vegetableOil
 * @type {farmhand.recipe}
 */
export const vegetableOil = itemify({
  id: 'vegetable-oil',
  name: 'Vegetable Oil',
  ingredients: {
    [items.soybean.id]: 350,
  },
  condition: state => state.itemsSold[items.soybean.id] >= 900,
  recipeType: recipeType.KITCHEN,
})

/**
 * @property farmhand.module:recipes.friedTofu
 * @type {farmhand.recipe}
 */
export const friedTofu = itemify({
  id: 'fried-tofu',
  name: 'Deep Fried Tofu',
  ingredients: {
    [tofu.id]: 1,
    [vegetableOil.id]: 2,
  },
  condition: state =>
    state.itemsSold[tofu.id] >= 50 && state.itemsSold[vegetableOil.id] >= 50,
  recipeType: recipeType.KITCHEN,
})

/**
 * @property farmhand.module:recipes.spicyPickledGarlic
 * @type {farmhand.recipe}
 */
export const spicyPickledGarlic = itemify({
  id: 'spicy-pickled-garlic',
  name: 'Spicy Pickled Garlic',
  ingredients: {
    [items.jalapeno.id]: 2,
    [items.garlic.id]: 5,
  },
  condition: state =>
    state.itemsSold[items.jalapeno.id] >= 12 &&
    state.itemsSold[items.garlic.id] >= 25,
  recipeType: recipeType.KITCHEN,
})

/**
 * @property farmhand.module:recipes.garlicFries
 * @type {farmhand.recipe}
 */
export const garlicFries = itemify({
  id: 'garlic-fries',
  name: 'Garlic Fries',
  ingredients: {
    [items.potato.id]: 5,
    [items.garlic.id]: 3,
    [vegetableOil.id]: 1,
    [salt.id]: 2,
  },
  condition: state =>
    state.itemsSold[items.potato.id] >= 50 &&
    state.itemsSold[items.garlic.id] >= 30,
  recipeType: recipeType.KITCHEN,
})

/**
 * @property farmhand.module:recipes.garlicBread
 * @type {farmhand.recipe}
 */
export const garlicBread = itemify({
  id: 'garlic-bread',
  name: 'Garlic Bread',
  ingredients: {
    [bread.id]: 1,
    [items.garlic.id]: 5,
    [oliveOil.id]: 1,
  },
  condition: state =>
    state.itemsSold[bread.id] >= 30 &&
    state.itemsSold[oliveOil.id] >= 20 &&
    state.itemsSold[items.garlic.id] >= 50,
  recipeType: recipeType.KITCHEN,
})

/**
 * @property farmhand.module:recipes.strawberryJam
 * @type {farmhand.recipe}
 */
export const strawberryJam = itemify({
  id: 'strawberry-jam',
  name: 'Strawberry Jam',
  ingredients: {
    [items.strawberry.id]: 10,
  },
  condition: state => state.itemsSold[items.strawberry.id] >= 60,
  recipeType: recipeType.KITCHEN,
})

/**
 * @property farmhand.module:recipes.popcorn
 * @type {farmhand.recipe}
 */
export const popcorn = itemify({
  id: 'popcorn',
  name: 'Popcorn',
  ingredients: {
    [items.corn.id]: 2,
    [butter.id]: 1,
  },
  condition: state =>
    state.itemsSold[items.corn.id] >= 12 && state.itemsSold[butter.id] >= 6,
  recipeType: recipeType.KITCHEN,
})

/**
 * @property farmhand.module:recipes.pumpkinPie
 * @type {farmhand.recipe}
 */
export const pumpkinPie = itemify({
  id: 'pumpkin-pie',
  name: 'Pumpkin Pie',
  ingredients: {
    [items.pumpkin.id]: 4,
    [items.wheat.id]: 10,
    [butter.id]: 2,
  },
  condition: state =>
    state.itemsSold[items.pumpkin.id] >= 200 &&
    state.itemsSold[items.wheat.id] >= 250 &&
    state.itemsSold[butter.id] >= 75,
  recipeType: recipeType.KITCHEN,
})

/**
 * @property farmhand.module:recipes.sweetPotatoPie
 * @type {farmhand.recipe}
 */
export const sweetPotatoPie = itemify({
  id: 'sweet-potato-pie',
  name: 'Sweet Potato Pie',
  ingredients: {
    [items.sweetPotato.id]: 6,
    [items.wheat.id]: 10,
    [butter.id]: 2,
  },
  condition: state =>
    state.itemsSold[items.sweetPotato.id] >= 200 &&
    state.itemsSold[items.wheat.id] >= 250 &&
    state.itemsSold[butter.id] >= 75,
  recipeType: recipeType.KITCHEN,
})

/**
 * @property farmhand.module:recipes.sweetPotatoFries
 * @type {farmhand.recipe}
 */
export const sweetPotatoFries = itemify({
  id: 'sweet-potato-fries',
  name: 'Sweet Potato Fries',
  ingredients: {
    [items.sweetPotato.id]: 10,
    [vegetableOil.id]: 1,
    [salt.id]: 1,
  },
  condition: state => state.itemsSold[items.sweetPotato.id] >= 100,
  recipeType: recipeType.KITCHEN,
})

/**
 * @property farmhand.module:recipes.onionRings
 * @type {farmhand.recipe}
 */
export const onionRings = itemify({
  id: 'onion-rings',
  name: 'Onion Rings',
  ingredients: {
    [items.onion.id]: 1,
    [vegetableOil.id]: 1,
    [items.wheat.id]: 5,
    [soyMilk.id]: 1,
    [salt.id]: 3,
  },
  condition: state =>
    state.itemsSold[items.onion.id] >= 50 &&
    state.itemsSold[vegetableOil.id] > 20 &&
    state.itemsSold[soyMilk.id] > 20 &&
    state.itemsSold[items.wheat.id] > 30,
  recipeType: recipeType.KITCHEN,
})

/**
 * @property farmhand.module:recipes.bronzeIngot
 * @type {farmhand.recipe}
 */
export const bronzeIngot = itemify({
  id: 'bronze-ingot',
  name: 'Bronze Ingot',
  ingredients: {
    [items.bronzeOre.id]: 5,
    [items.coal.id]: 5,
  },
  condition: state =>
    state.purchasedSmelter > 0 && state.itemsSold[items.bronzeOre.id] >= 50,
  recipeType: recipeType.FORGE,
})

/**
 * @property farmhand.module:recipes.ironIngot
 * @type {farmhand.recipe}
 */
export const ironIngot = itemify({
  id: 'iron-ingot',
  name: 'Iron Ingot',
  ingredients: {
    [items.ironOre.id]: 5,
    [items.coal.id]: 12,
  },
  condition: state =>
    state.purchasedSmelter > 0 && state.itemsSold[items.ironOre.id] >= 50,
  recipeType: recipeType.FORGE,
})

/**
 * @property farmhand.module:recipes.silverIngot
 * @type {farmhand.recipe}
 */
export const silverIngot = itemify({
  id: 'silver-ingot',
  name: 'Silver Ingot',
  ingredients: {
    [items.silverOre.id]: 5,
    [items.coal.id]: 8,
  },
  condition: state =>
    state.purchasedSmelter > 0 && state.itemsSold[items.silverOre.id] >= 50,
  recipeType: recipeType.FORGE,
})

/**
 * @property farmhand.module:recipes.goldIngot
 * @type {farmhand.recipe}
 */
export const goldIngot = itemify({
  id: 'gold-ingot',
  name: 'Gold Ingot',
  ingredients: {
    [items.goldOre.id]: 5,
    [items.coal.id]: 10,
  },
  condition: state =>
    state.purchasedSmelter > 0 && state.itemsSold[items.goldOre.id] >= 50,
  recipeType: recipeType.FORGE,
})

export const compost = itemify({
  id: 'compost',
  name: 'Compost',
  ingredients: {
    [items.weed.id]: 25,
  },
  condition: state =>
    state.purchasedComposter > 0 && state.itemsSold[items.weed.id] >= 100,
  description: 'Can be used to make fertilizer.',
  recipeType: recipeType.RECYCLING,
  type: itemType.CRAFTED_ITEM,
})

/**
 * @property farmhand.module:recipes.fertilizer
 * @type {farmhand.item}
 */
export const fertilizer = itemify({
  id: 'fertilizer',
  name: 'Fertilizer',
  ingredients: {
    [compost.id]: 10,
  },
  condition: state =>
    state.purchasedComposter > 0 && state.itemsSold[compost.id] >= 10,
  description: 'Helps crops grow and mature a little faster.',
  enablesFieldMode: fieldMode.FERTILIZE,
  recipeType: recipeType.RECYCLING,
  type: itemType.FERTILIZER,
  value: 25,
})

/**
 * @property farmhand.module:recipes.wineChardonnay
 */
export const wineChardonnay = getWineRecipeFromGrape({
  ...items.grapeChardonnay,
})

/**
 * @property farmhand.module:recipes.wineSauvignonBlanc
 */
export const wineSauvignonBlanc = getWineRecipeFromGrape({
  ...items.grapeSauvignonBlanc,
})

///**
// * @property farmhand.module:recipes.winePinotBlanc
// */
//export const winePinotBlanc = getWineRecipeFromGrape({
//  ...items.grapePinotBlanc,
//})

///**
// * @property farmhand.module:recipes.wineMuscat
// */
//export const wineMuscat = getWineRecipeFromGrape({
//  ...items.grapeMuscat,
//})

///**
// * @property farmhand.module:recipes.wineRiesling
// */
//export const wineRiesling = getWineRecipeFromGrape({
//  ...items.grapeRiesling,
//})

///**
// * @property farmhand.module:recipes.wineMerlot
// */
//export const wineMerlot = getWineRecipeFromGrape({
//  ...items.grapeMerlot,
//})

/**
 * @property farmhand.module:recipes.wineCabernetSauvignon
 */
export const wineCabernetSauvignon = getWineRecipeFromGrape({
  ...items.grapeCabernetSauvignon,
})

///**
// * @property farmhand.module:recipes.wineSyrah
// */
//export const wineSyrah = getWineRecipeFromGrape({
//  ...items.grapeSyrah,
//})

/**
 * @property farmhand.module:recipes.wineTempranillo
 */
export const wineTempranillo = getWineRecipeFromGrape({
  ...items.grapeTempranillo,
})

/**
 * @property farmhand.module:recipes.wineNebbiolo
 */
export const wineNebbiolo = getWineRecipeFromGrape({
  ...items.grapeNebbiolo,
})
