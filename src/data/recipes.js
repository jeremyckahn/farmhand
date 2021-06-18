/**
 * @module farmhand.recipes
 */
import { itemType } from '../enums'
import { RECIPE_INGREDIENT_VALUE_MULTIPLIER } from '../constants'

import * as items from './items'
import baseItemsMap from './items-map'

const itemsMap = { ...baseItemsMap }

const itemify = recipe => {
  const item = Object.freeze({
    ...recipe,
    type: itemType.CRAFTED_ITEM,
    value: Object.keys(recipe.ingredients).reduce(
      (sum, itemId) =>
        sum +
        RECIPE_INGREDIENT_VALUE_MULTIPLIER *
          itemsMap[itemId].value *
          recipe.ingredients[itemId],
      0
    ),
  })

  itemsMap[recipe.id] = item

  return item
}

/**
 * @property farmhand.module:recipes.bread
 * @type {farmhand.recipe}
 */
export const bread = itemify({
  id: 'bread',
  name: 'Bread',
  ingredients: {
    [items.wheat.id]: 15,
  },
  condition: state => state.itemsSold[items.wheat.id] >= 30,
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
  },
  condition: state =>
    state.itemsSold[items.onion.id] >= 15 && state.itemsSold[cheese.id] >= 10,
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
  },
  condition: state => state.itemsSold[items.jalapeno.id] >= 50,
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
    [cheese.id]: 1,
  },
  condition: state =>
    state.itemsSold[items.jalapeno.id] >= 20 &&
    state.itemsSold[cheese.id] >= 5 &&
})
