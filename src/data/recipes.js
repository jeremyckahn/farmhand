/**
 * @module farmhand.recipes
 */
import { itemType, fieldMode, recipeType } from '../enums'
import { RECIPE_INGREDIENT_VALUE_MULTIPLIER } from '../constants'

import * as items from './items'
import baseItemsMap from './items-map'

const itemsMap = { ...baseItemsMap }

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

  itemsMap[recipe.playerId] = item

  return item
}

/**
 * @property farmhand.module:recipes.bread
 * @type {farmhand.recipe}
 */
export const bread = itemify({
  playerId: 'bread',
  name: 'Bread',
  ingredients: {
    [items.wheat.playerId]: 15,
  },
  condition: state => state.itemsSold[items.wheat.playerId] >= 30,
  recipeType: recipeType.KITCHEN,
})

/**
 * @property farmhand.module:recipes.butter
 * @type {farmhand.recipe}
 */
export const butter = itemify({
  playerId: 'butter',
  name: 'Butter',
  ingredients: {
    [items.milk3.playerId]: 5,
  },
  condition: state => state.itemsSold[items.milk3.playerId] >= 30,
  recipeType: recipeType.KITCHEN,
})

/**
 * @property farmhand.module:recipes.sunButter
 * @type {farmhand.recipe}
 */
export const sunButter = itemify({
  playerId: 'sun-butter',
  name: 'Sun Butter',
  ingredients: {
    [items.sunflower.playerId]: 25,
  },
  condition: state => state.itemsSold[items.sunflower.playerId] >= 200,
  recipeType: recipeType.KITCHEN,
})

/*
 * @property farmhand.module:recipes.oliveOil
 * @type {farmhand.recipe}
 */
export const oliveOil = itemify({
  playerId: 'olive-oil',
  name: 'Olive Oil',
  ingredients: {
    [items.olive.playerId]: 250,
  },
  condition: state => state.itemsSold[items.olive.playerId] >= 500,
  recipeType: recipeType.KITCHEN,
})

/**
 * @property farmhand.module:recipes.cheese
 * @type {farmhand.recipe}
 */
export const cheese = itemify({
  playerId: 'cheese',
  name: 'Cheese',
  ingredients: {
    [items.milk3.playerId]: 8,
  },
  condition: state => (state.itemsSold[items.milk3.playerId] || 0) >= 20,
  recipeType: recipeType.KITCHEN,
})

/**
 * @property farmhand.module:recipes.rainbowCheese
 * @type {farmhand.recipe}
 */
export const rainbowCheese = itemify({
  playerId: 'rainbowCheese',
  name: 'Rainbow Cheese',
  ingredients: {
    [items.rainbowMilk3.playerId]: 10,
  },
  condition: state => (state.itemsSold[items.rainbowMilk3.playerId] || 0) >= 30,
  recipeType: recipeType.KITCHEN,
})

/**
 * @property farmhand.module:recipes.chocolate
 * @type {farmhand.recipe}
 */
export const chocolate = itemify({
  playerId: 'chocolate',
  name: 'Chocolate',
  ingredients: {
    [items.chocolateMilk.playerId]: 10,
  },
  condition: state => (state.itemsSold[items.chocolateMilk.playerId] || 0) >= 25,
  recipeType: recipeType.KITCHEN,
})

/**
 * @property farmhand.module:recipes.carrotSoup
 * @type {farmhand.recipe}
 */
export const carrotSoup = itemify({
  playerId: 'carrot-soup',
  name: 'Carrot Soup',
  ingredients: {
    [items.carrot.playerId]: 4,
  },
  condition: state => (state.itemsSold[items.carrot.playerId] || 0) >= 10,
  recipeType: recipeType.KITCHEN,
})

/**
 * @property farmhand.module:recipes.jackolantern
 * @type {farmhand.recipe}
 */
export const jackolantern = itemify({
  playerId: 'jackolantern',
  name: "Jack-o'-lantern",
  ingredients: {
    [items.pumpkin.playerId]: 1,
  },
  condition: state => (state.itemsSold[items.pumpkin.playerId] || 0) >= 50,
  recipeType: recipeType.KITCHEN,
})

/**
 * @property farmhand.module:recipes.spaghetti
 * @type {farmhand.recipe}
 */
export const spaghetti = itemify({
  playerId: 'spaghetti',
  name: 'Spaghetti',
  ingredients: {
    [items.wheat.playerId]: 10,
    [items.tomato.playerId]: 2,
  },
  condition: state =>
    state.itemsSold[items.wheat.playerId] >= 20 &&
    state.itemsSold[items.tomato.playerId] >= 5,
  recipeType: recipeType.KITCHEN,
})

/**
 * @property farmhand.module:recipes.frenchOnionSoup
 * @type {farmhand.recipe}
 */
export const frenchOnionSoup = itemify({
  playerId: 'french-onion-soup',
  name: 'French Onion Soup',
  ingredients: {
    [items.onion.playerId]: 5,
    [cheese.playerId]: 2,
  },
  condition: state =>
    state.itemsSold[items.onion.playerId] >= 15 && state.itemsSold[cheese.playerId] >= 10,
  recipeType: recipeType.KITCHEN,
})

/**
 * @property farmhand.module:recipes.burger
 * @type {farmhand.recipe}
 */
export const burger = itemify({
  playerId: 'burger',
  name: 'Burger',
  ingredients: {
    [bread.playerId]: 1,
    [cheese.playerId]: 1,
    [items.onion.playerId]: 1,
    [items.soybean.playerId]: 12,
    [items.spinach.playerId]: 1,
    [items.tomato.playerId]: 1,
  },
  condition: state =>
    state.itemsSold[bread.playerId] >= 5 &&
    state.itemsSold[cheese.playerId] >= 5 &&
    state.itemsSold[items.onion.playerId] >= 5 &&
    state.itemsSold[items.soybean.playerId] >= 25 &&
    state.itemsSold[items.spinach.playerId] >= 5 &&
    state.itemsSold[items.tomato.playerId] >= 5,
  recipeType: recipeType.KITCHEN,
})

/**
 * @property farmhand.module:recipes.summerSalad
 * @type {farmhand.recipe}
 */
export const summerSalad = itemify({
  playerId: 'summer-salad',
  name: 'Summer Salad',
  ingredients: {
    [items.spinach.playerId]: 6,
    [items.corn.playerId]: 1,
    [items.carrot.playerId]: 1,
  },
  condition: state =>
    state.itemsSold[items.spinach.playerId] >= 30 &&
    state.itemsSold[items.corn.playerId] > 5 &&
    state.itemsSold[items.carrot.playerId] > 5,
  recipeType: recipeType.KITCHEN,
})

/**
 * @property farmhand.module:recipes.soyMilk
 * @type {farmhand.recipe}
 */
export const soyMilk = itemify({
  playerId: 'soy-milk',
  name: 'Soy Milk',
  ingredients: {
    [items.soybean.playerId]: 20,
  },
  condition: state => state.itemsSold[items.soybean.playerId] >= 100,
  recipeType: recipeType.KITCHEN,
})

/**
 * @property farmhand.module:recipes.chocolateSoyMilk
 * @type {farmhand.recipe}
 */
export const chocolateSoyMilk = itemify({
  playerId: 'chocolate-soy-milk',
  name: 'Chocolate Soy Milk',
  ingredients: {
    [soyMilk.playerId]: 1,
    [chocolate.playerId]: 1,
  },
  condition: state =>
    state.itemsSold[soyMilk.playerId] >= 5 && state.itemsSold[chocolate.playerId] >= 5,
  recipeType: recipeType.KITCHEN,
})

/**
 * @property farmhand.module:recipes.tofu
 * @type {farmhand.recipe}
 */
export const tofu = itemify({
  playerId: 'tofu',
  name: 'Tofu',
  ingredients: {
    [soyMilk.playerId]: 4,
  },
  condition: state => state.itemsSold[soyMilk.playerId] >= 20,
  recipeType: recipeType.KITCHEN,
})

/**
 * @property farmhand.module:recipes.chicknPotPie
 * @type {farmhand.recipe}
 */
export const chicknPotPie = itemify({
  playerId: 'chickn-pot-pie',
  name: "Chick'n Pot Pie",
  ingredients: {
    [tofu.playerId]: 6,
    [items.pea.playerId]: 10,
    [items.carrot.playerId]: 8,
    [items.wheat.playerId]: 12,
    [soyMilk.playerId]: 3,
  },
  condition: state =>
    state.itemsSold[tofu.playerId] >= 30 &&
    state.itemsSold[items.pea.playerId] >= 225 &&
    state.itemsSold[items.carrot.playerId] >= 300 &&
    state.itemsSold[items.wheat.playerId] >= 425 &&
    state.itemsSold[soyMilk.playerId] >= 15,
  recipeType: recipeType.KITCHEN,
})

/**
 * @property farmhand.module:recipes.hotSauce
 * @type {farmhand.recipe}
 */
export const hotSauce = itemify({
  playerId: 'hot-sauce',
  name: 'Hot Sauce',
  ingredients: {
    [items.jalapeno.playerId]: 10,
  },
  condition: state => state.itemsSold[items.jalapeno.playerId] >= 50,
  recipeType: recipeType.KITCHEN,
})

/**
 * @property farmhand.module:recipes.salsa
 * @type {farmhand.recipe}
 */
export const salsa = itemify({
  playerId: 'salsa',
  name: 'Salsa',
  ingredients: {
    [items.jalapeno.playerId]: 1,
    [items.onion.playerId]: 1,
    [items.tomato.playerId]: 1,
    [items.corn.playerId]: 1,
  },
  condition: state =>
    state.itemsSold[items.jalapeno.playerId] >= 5 &&
    state.itemsSold[items.onion.playerId] >= 5 &&
    state.itemsSold[items.tomato.playerId] >= 5 &&
    state.itemsSold[items.corn.playerId] >= 5,
  recipeType: recipeType.KITCHEN,
})

/**
 * @property farmhand.module:recipes.spicyCheese
 * @type {farmhand.recipe}
 */
export const spicyCheese = itemify({
  playerId: 'spicy-cheese',
  name: 'Spicy Cheese',
  ingredients: {
    [items.jalapeno.playerId]: 4,
    [items.milk3.playerId]: 10,
  },
  condition: state =>
    state.itemsSold[items.jalapeno.playerId] >= 20 &&
    state.itemsSold[items.milk3.playerId] >= 50,
  recipeType: recipeType.KITCHEN,
})

/**
 * @property farmhand.module:recipes.vegetableOil
 * @type {farmhand.recipe}
 */
export const vegetableOil = itemify({
  playerId: 'vegetable-oil',
  name: 'Vegetable Oil',
  ingredients: {
    [items.soybean.playerId]: 350,
  },
  condition: state => state.itemsSold[items.soybean.playerId] >= 900,
  recipeType: recipeType.KITCHEN,
})

/**
 * @property farmhand.module:recipes.friedTofu
 * @type {farmhand.recipe}
 */
export const friedTofu = itemify({
  playerId: 'fried-tofu',
  name: 'Deep Fried Tofu',
  ingredients: {
    [tofu.playerId]: 1,
    [vegetableOil.playerId]: 2,
  },
  condition: state =>
    state.itemsSold[tofu.playerId] >= 50 && state.itemsSold[vegetableOil.playerId] >= 50,
  recipeType: recipeType.KITCHEN,
})

/**
 * @property farmhand.module:recipes.spicyPickledGarlic
 * @type {farmhand.recipe}
 */
export const spicyPickledGarlic = itemify({
  playerId: 'spicy-pickled-garlic',
  name: 'Spicy Pickled Garlic',
  ingredients: {
    [items.jalapeno.playerId]: 2,
    [items.garlic.playerId]: 5,
  },
  condition: state =>
    state.itemsSold[items.jalapeno.playerId] >= 12 &&
    state.itemsSold[items.garlic.playerId] >= 25,
  recipeType: recipeType.KITCHEN,
})

/**
 * @property farmhand.module:recipes.garlicFries
 * @type {farmhand.recipe}
 */
export const garlicFries = itemify({
  playerId: 'garlic-fries',
  name: 'Garlic Fries',
  ingredients: {
    [items.potato.playerId]: 5,
    [items.garlic.playerId]: 3,
    [vegetableOil.playerId]: 1,
  },
  condition: state =>
    state.itemsSold[items.potato.playerId] >= 50 &&
    state.itemsSold[items.garlic.playerId] >= 30,
  recipeType: recipeType.KITCHEN,
})

/**
 * @property farmhand.module:recipes.garlicBread
 * @type {farmhand.recipe}
 */
export const garlicBread = itemify({
  playerId: 'garlic-bread',
  name: 'Garlic Bread',
  ingredients: {
    [bread.playerId]: 1,
    [items.garlic.playerId]: 5,
    [oliveOil.playerId]: 1,
  },
  condition: state =>
    state.itemsSold[bread.playerId] >= 30 &&
    state.itemsSold[oliveOil.playerId] >= 20 &&
    state.itemsSold[items.garlic.playerId] >= 50,
  recipeType: recipeType.KITCHEN,
})

/**
 * @property farmhand.module:recipes.strawberryJam
 * @type {farmhand.recipe}
 */
export const strawberryJam = itemify({
  playerId: 'strawberry-jam',
  name: 'Strawberry Jam',
  ingredients: {
    [items.strawberry.playerId]: 10,
  },
  condition: state => state.itemsSold[items.strawberry.playerId] >= 60,
  recipeType: recipeType.KITCHEN,
})

/**
 * @property farmhand.module:recipes.popcorn
 * @type {farmhand.recipe}
 */
export const popcorn = itemify({
  playerId: 'popcorn',
  name: 'Popcorn',
  ingredients: {
    [items.corn.playerId]: 2,
    [butter.playerId]: 1,
  },
  condition: state =>
    state.itemsSold[items.corn.playerId] >= 12 && state.itemsSold[butter.playerId] >= 6,
  recipeType: recipeType.KITCHEN,
})

/**
 * @property farmhand.module:recipes.pumpkinPie
 * @type {farmhand.recipe}
 */
export const pumpkinPie = itemify({
  playerId: 'pumpkin-pie',
  name: 'Pumpkin Pie',
  ingredients: {
    [items.pumpkin.playerId]: 4,
    [items.wheat.playerId]: 10,
    [butter.playerId]: 2,
  },
  condition: state =>
    state.itemsSold[items.pumpkin.playerId] >= 200 &&
    state.itemsSold[items.wheat.playerId] >= 250 &&
    state.itemsSold[butter.playerId] >= 75,
  recipeType: recipeType.KITCHEN,
})

/**
 * @property farmhand.module:recipes.sweetPotatoPie
 * @type {farmhand.recipe}
 */
export const sweetPotatoPie = itemify({
  playerId: 'sweet-potato-pie',
  name: 'Sweet Potato Pie',
  ingredients: {
    [items.sweetPotato.playerId]: 6,
    [items.wheat.playerId]: 10,
    [butter.playerId]: 2,
  },
  condition: state =>
    state.itemsSold[items.sweetPotato.playerId] >= 200 &&
    state.itemsSold[items.wheat.playerId] >= 250 &&
    state.itemsSold[butter.playerId] >= 75,
  recipeType: recipeType.KITCHEN,
})

/**
 * @property farmhand.module:recipes.sweetPotatoFries
 * @type {farmhand.recipe}
 */
export const sweetPotatoFries = itemify({
  playerId: 'sweet-potato-fries',
  name: 'Sweet Potato Fries',
  ingredients: {
    [items.sweetPotato.playerId]: 10,
    [vegetableOil.playerId]: 1,
  },
  condition: state => state.itemsSold[items.sweetPotato.playerId] >= 100,
  recipeType: recipeType.KITCHEN,
})

/**
 * @property farmhand.module:recipes.onionRings
 * @type {farmhand.recipe}
 */
export const onionRings = itemify({
  playerId: 'onion-rings',
  name: 'Onion Rings',
  ingredients: {
    [items.onion.playerId]: 1,
    [vegetableOil.playerId]: 1,
    [items.wheat.playerId]: 5,
    [soyMilk.playerId]: 1,
  },
  condition: state =>
    state.itemsSold[items.onion.playerId] >= 50 &&
    state.itemsSold[vegetableOil.playerId] > 20 &&
    state.itemsSold[soyMilk.playerId] > 20 &&
    state.itemsSold[items.wheat.playerId] > 30,
  recipeType: recipeType.KITCHEN,
})

/**
 * @property farmhand.module:recipes.bronzeIngot
 * @type {farmhand.recipe}
 */
export const bronzeIngot = itemify({
  playerId: 'bronze-ingot',
  name: 'Bronze Ingot',
  ingredients: {
    [items.bronzeOre.playerId]: 5,
    [items.coal.playerId]: 5,
  },
  condition: state =>
    state.purchasedSmelter && state.itemsSold[items.bronzeOre.playerId] >= 50,
  recipeType: recipeType.FORGE,
})

/**
 * @property farmhand.module:recipes.ironIngot
 * @type {farmhand.recipe}
 */
export const ironIngot = itemify({
  playerId: 'iron-ingot',
  name: 'Iron Ingot',
  ingredients: {
    [items.ironOre.playerId]: 5,
    [items.coal.playerId]: 12,
  },
  condition: state =>
    state.purchasedSmelter && state.itemsSold[items.ironOre.playerId] >= 50,
  recipeType: recipeType.FORGE,
})

/**
 * @property farmhand.module:recipes.silverIngot
 * @type {farmhand.recipe}
 */
export const silverIngot = itemify({
  playerId: 'silver-ingot',
  name: 'Silver Ingot',
  ingredients: {
    [items.silverOre.playerId]: 5,
    [items.coal.playerId]: 8,
  },
  condition: state =>
    state.purchasedSmelter && state.itemsSold[items.silverOre.playerId] >= 50,
  recipeType: recipeType.FORGE,
})

/**
 * @property farmhand.module:recipes.goldIngot
 * @type {farmhand.recipe}
 */
export const goldIngot = itemify({
  playerId: 'gold-ingot',
  name: 'Gold Ingot',
  ingredients: {
    [items.goldOre.playerId]: 5,
    [items.coal.playerId]: 10,
  },
  condition: state =>
    state.purchasedSmelter && state.itemsSold[items.goldOre.playerId] >= 50,
  recipeType: recipeType.FORGE,
})

export const compost = itemify({
  playerId: 'compost',
  name: 'Compost',
  ingredients: {
    [items.weed.playerId]: 25,
  },
  condition: state =>
    state.purchasedComposter && state.itemsSold[items.weed.playerId] >= 100,
  description: 'Can be used to make fertilizer.',
  recipeType: recipeType.RECYCLING,
  type: itemType.CRAFTED_ITEM,
})

/**
 * @property farmhand.module:recipes.fertilizer
 * @type {farmhand.item}
 */
export const fertilizer = itemify({
  playerId: 'fertilizer',
  name: 'Fertilizer',
  ingredients: {
    [compost.playerId]: 10,
  },
  condition: state =>
    state.purchasedComposter && state.itemsSold[compost.playerId] >= 10,
  description: 'Helps crops grow and mature a little faster.',
  enablesFieldMode: fieldMode.FERTILIZE,
  recipeType: recipeType.RECYCLING,
  type: itemType.FERTILIZER,
  value: 25,
})
