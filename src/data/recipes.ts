/**
 * @module farmhand.recipes
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
 * @param } partialRecipe

 */
const convertToRecipe = partialRecipe => {
  const recipe = Object.freeze({
    type: itemType.CRAFTED_ITEM,
    value: Object.keys(partialRecipe.ingredients).reduce(
      (sum, itemId) =>
        sum +
        RECIPE_INGREDIENT_VALUE_MULTIPLIER *
          itemsMap[itemId].value *
          partialRecipe.ingredients[itemId],
      0
    ),
    ...partialRecipe,
  })

  itemsMap[partialRecipe.id] = /** @type {farmhand.item} */ recipe

  return /** @type {farmhand.recipe} */ recipe
}

/**
 * @property farmhand.module:recipes.salt

 */
export const salt: any = convertToRecipe({
  id: 'salt',
  name: 'Salt',
  ingredients: {
    [items.saltRock.id]: 1,
  },
  condition: state => (state.itemsSold[items.saltRock.id] || 0) >= 30,
  description: 'Useful for seasoning food and fermentation.',
  recipeType: /** @type {farmhand.recipeType} */ recipeType.KITCHEN,
})

/**
 * @property farmhand.module:recipes.flour

 */
export const flour: any = convertToRecipe({
  id: 'flour',
  name: 'Flour',
  ingredients: {
    [items.wheat.id]: 10,
  },
  condition: state => (state.itemsSold[items.wheat.id] || 0) >= 20,
  recipeType: /** @type {farmhand.recipeType} */ recipeType.KITCHEN,
})

/**
 * @property farmhand.module:recipes.yeast

 */
export const yeast: any = convertToRecipe({
  id: 'yeast',
  name: 'Yeast',
  ingredients: {
    [flour.id]: 5,
  },
  condition: state => (state.itemsSold[flour.id] || 0) >= 25,
  recipeType: /** @type {farmhand.recipeType} */ recipeType.KITCHEN,
})


const getWineRecipeFromGrape = grape => {
  return {
    ...convertToRecipe({
      id: grape.wineId,
      name: `${grapeVarietyNameMap[grape.variety]} Wine`,
      type: itemType.CRAFTED_ITEM,
      ingredients: {
        [grape.id]: GRAPES_REQUIRED_FOR_WINE,
        [yeast.id]: getYeastRequiredForWine(grape.variety),
      },
      recipeType: /** @type {farmhand.recipeType} */ recipeType.WINE,
      // NOTE: This prevents wines from appearing in the Learned Recipes list in the Workshop
      condition: () => false,
    }),
    variety: grape.variety,
  }
}

/**
 * @property farmhand.module:recipes.bread

 */
export const bread: any = convertToRecipe({
  id: 'bread',
  name: 'Bread',
  ingredients: {
    [flour.id]: 10,
    [yeast.id]: 5,
  },
  condition: state =>
    (state.itemsSold[flour.id] || 0) >= 30 &&
    (state.itemsSold[yeast.id] || 0) >= 15,
  recipeType: /** @type {farmhand.recipeType} */ recipeType.KITCHEN,
})

/**
 * @property farmhand.module:recipes.butter

 */
export const butter: any = convertToRecipe({
  id: 'butter',
  name: 'Butter',
  ingredients: {
    [items.milk3.id]: 5,
  },
  condition: state => (state.itemsSold[items.milk3.id] || 0) >= 30,
  recipeType: /** @type {farmhand.recipeType} */ recipeType.KITCHEN,
})

/**
 * @property farmhand.module:recipes.sunButter

 */
export const sunButter: any = convertToRecipe({
  id: 'sun-butter',
  name: 'Sun Butter',
  ingredients: {
    [items.sunflower.id]: 25,
  },
  condition: state => (state.itemsSold[items.sunflower.id] || 0) >= 200,
  recipeType: /** @type {farmhand.recipeType} */ recipeType.KITCHEN,
})

/*
 * @property farmhand.module:recipes.oliveOil
 * @type {farmhand.recipe}
 */
export const oliveOil = convertToRecipe({
  id: 'olive-oil',
  name: 'Olive Oil',
  ingredients: {
    [items.olive.id]: 250,
  },
  condition: state => (state.itemsSold[items.olive.id] || 0) >= 500,
  recipeType: /** @type {farmhand.recipeType} */ recipeType.KITCHEN,
})

/**
 * @property farmhand.module:recipes.cheese

 */
export const cheese: any = convertToRecipe({
  id: 'cheese',
  name: 'Cheese',
  ingredients: {
    [items.milk3.id]: 8,
  },
  condition: state => (state.itemsSold[items.milk3.id] || 0) >= 20,
  recipeType: /** @type {farmhand.recipeType} */ recipeType.KITCHEN,
})

/**
 * @property farmhand.module:recipes.rainbowCheese

 */
export const rainbowCheese: any = convertToRecipe({
  id: 'rainbowCheese',
  name: 'Rainbow Cheese',
  ingredients: {
    [items.rainbowMilk3.id]: 10,
  },
  condition: state => (state.itemsSold[items.rainbowMilk3.id] || 0) >= 30,
  recipeType: /** @type {farmhand.recipeType} */ recipeType.KITCHEN,
})

/**
 * @property farmhand.module:recipes.chocolate

 */
export const chocolate: any = convertToRecipe({
  id: 'chocolate',
  name: 'Chocolate',
  ingredients: {
    [items.chocolateMilk.id]: 10,
  },
  condition: state => (state.itemsSold[items.chocolateMilk.id] || 0) >= 25,
  recipeType: /** @type {farmhand.recipeType} */ recipeType.KITCHEN,
})

/**
 * @property farmhand.module:recipes.carrotSoup

 */
export const carrotSoup: any = convertToRecipe({
  id: 'carrot-soup',
  name: 'Carrot Soup',
  ingredients: {
    [items.carrot.id]: 4,
  },
  condition: state => (state.itemsSold[items.carrot.id] || 0) >= 10,
  recipeType: /** @type {farmhand.recipeType} */ recipeType.KITCHEN,
})

/**
 * @property farmhand.module:recipes.jackolantern

 */
export const jackolantern: any = convertToRecipe({
  id: 'jackolantern',
  name: "Jack-o'-lantern",
  ingredients: {
    [items.pumpkin.id]: 1,
  },
  condition: state => (state.itemsSold[items.pumpkin.id] || 0) >= 50,
  recipeType: /** @type {farmhand.recipeType} */ recipeType.KITCHEN,
})

/**
 * @property farmhand.module:recipes.spaghetti

 */
export const spaghetti: any = convertToRecipe({
  id: 'spaghetti',
  name: 'Spaghetti',
  ingredients: {
    [items.wheat.id]: 10,
    [items.tomato.id]: 2,
  },
  condition: state =>
    (state.itemsSold[items.wheat.id] || 0) >= 20 &&
    (state.itemsSold[items.tomato.id] || 0) >= 5,
  recipeType: /** @type {farmhand.recipeType} */ recipeType.KITCHEN,
})

/**
 * @property farmhand.module:recipes.frenchOnionSoup

 */
export const frenchOnionSoup: any = convertToRecipe({
  id: 'french-onion-soup',
  name: 'French Onion Soup',
  ingredients: {
    [items.onion.id]: 5,
    [cheese.id]: 2,
    [salt.id]: 2,
  },
  condition: state =>
    (state.itemsSold[items.onion.id] || 0) >= 15 &&
    (state.itemsSold[cheese.id] || 0) >= 10,
  recipeType: /** @type {farmhand.recipeType} */ recipeType.KITCHEN,
})

/**
 * @property farmhand.module:recipes.burger

 */
export const burger: any = convertToRecipe({
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
    (state.itemsSold[bread.id] || 0) >= 5 &&
    (state.itemsSold[cheese.id] || 0) >= 5 &&
    (state.itemsSold[items.onion.id] || 0) >= 5 &&
    (state.itemsSold[items.soybean.id] || 0) >= 25 &&
    (state.itemsSold[items.spinach.id] || 0) >= 5 &&
    (state.itemsSold[items.tomato.id] || 0) >= 5,
  recipeType: /** @type {farmhand.recipeType} */ recipeType.KITCHEN,
})

/**
 * @property farmhand.module:recipes.summerSalad

 */
export const summerSalad: any = convertToRecipe({
  id: 'summer-salad',
  name: 'Summer Salad',
  ingredients: {
    [items.spinach.id]: 6,
    [items.corn.id]: 1,
    [items.carrot.id]: 1,
  },
  condition: state =>
    (state.itemsSold[items.spinach.id] || 0) >= 30 &&
    (state.itemsSold[items.corn.id] || 0) > 5 &&
    (state.itemsSold[items.carrot.id] || 0) > 5,
  recipeType: /** @type {farmhand.recipeType} */ recipeType.KITCHEN,
})

/**
 * @property farmhand.module:recipes.soyMilk

 */
export const soyMilk: any = convertToRecipe({
  id: 'soy-milk',
  name: 'Soy Milk',
  ingredients: {
    [items.soybean.id]: 20,
  },
  condition: state => (state.itemsSold[items.soybean.id] || 0) >= 100,
  recipeType: /** @type {farmhand.recipeType} */ recipeType.KITCHEN,
})

/**
 * @property farmhand.module:recipes.chocolateSoyMilk

 */
export const chocolateSoyMilk: any = convertToRecipe({
  id: 'chocolate-soy-milk',
  name: 'Chocolate Soy Milk',
  ingredients: {
    [soyMilk.id]: 1,
    [chocolate.id]: 1,
  },
  condition: state =>
    (state.itemsSold[soyMilk.id] || 0) >= 5 &&
    (state.itemsSold[chocolate.id] || 0) >= 5,
  recipeType: /** @type {farmhand.recipeType} */ recipeType.KITCHEN,
})

/**
 * @property farmhand.module:recipes.tofu

 */
export const tofu: any = convertToRecipe({
  id: 'tofu',
  name: 'Tofu',
  ingredients: {
    [soyMilk.id]: 4,
  },
  condition: state => (state.itemsSold[soyMilk.id] || 0) >= 20,
  recipeType: /** @type {farmhand.recipeType} */ recipeType.KITCHEN,
})

/**
 * @property farmhand.module:recipes.chicknPotPie

 */
export const chicknPotPie: any = convertToRecipe({
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
    (state.itemsSold[tofu.id] || 0) >= 30 &&
    (state.itemsSold[items.pea.id] || 0) >= 225 &&
    (state.itemsSold[items.carrot.id] || 0) >= 300 &&
    (state.itemsSold[items.wheat.id] || 0) >= 425 &&
    (state.itemsSold[soyMilk.id] || 0) >= 15,
  recipeType: /** @type {farmhand.recipeType} */ recipeType.KITCHEN,
})

/**
 * @property farmhand.module:recipes.hotSauce

 */
export const hotSauce: any = convertToRecipe({
  id: 'hot-sauce',
  name: 'Hot Sauce',
  ingredients: {
    [items.jalapeno.id]: 10,
    [salt.id]: 1,
  },
  condition: state => (state.itemsSold[items.jalapeno.id] || 0) >= 50,
  recipeType: /** @type {farmhand.recipeType} */ recipeType.KITCHEN,
})

/**
 * @property farmhand.module:recipes.salsa

 */
export const salsa: any = convertToRecipe({
  id: 'salsa',
  name: 'Salsa',
  ingredients: {
    [items.jalapeno.id]: 1,
    [items.onion.id]: 1,
    [items.tomato.id]: 1,
    [items.corn.id]: 1,
  },
  condition: state =>
    (state.itemsSold[items.jalapeno.id] || 0) >= 5 &&
    (state.itemsSold[items.onion.id] || 0) >= 5 &&
    (state.itemsSold[items.tomato.id] || 0) >= 5 &&
    (state.itemsSold[items.corn.id] || 0) >= 5,
  recipeType: /** @type {farmhand.recipeType} */ recipeType.KITCHEN,
})

/**
 * @property farmhand.module:recipes.spicyCheese

 */
export const spicyCheese: any = convertToRecipe({
  id: 'spicy-cheese',
  name: 'Spicy Cheese',
  ingredients: {
    [items.jalapeno.id]: 4,
    [items.milk3.id]: 10,
  },
  condition: state =>
    (state.itemsSold[items.jalapeno.id] || 0) >= 20 &&
    (state.itemsSold[items.milk3.id] || 0) >= 50,
  recipeType: /** @type {farmhand.recipeType} */ recipeType.KITCHEN,
})

/**
 * @property farmhand.module:recipes.vegetableOil

 */
export const vegetableOil: any = convertToRecipe({
  id: 'vegetable-oil',
  name: 'Vegetable Oil',
  ingredients: {
    [items.soybean.id]: 350,
  },
  condition: state => (state.itemsSold[items.soybean.id] || 0) >= 900,
  recipeType: /** @type {farmhand.recipeType} */ recipeType.KITCHEN,
})

/**
 * @property farmhand.module:recipes.friedTofu

 */
export const friedTofu: any = convertToRecipe({
  id: 'fried-tofu',
  name: 'Deep Fried Tofu',
  ingredients: {
    [tofu.id]: 1,
    [vegetableOil.id]: 2,
  },
  condition: state =>
    (state.itemsSold[tofu.id] || 0) >= 50 &&
    (state.itemsSold[vegetableOil.id] || 0) >= 50,
  recipeType: /** @type {farmhand.recipeType} */ recipeType.KITCHEN,
})

/**
 * @property farmhand.module:recipes.spicyPickledGarlic

 */
export const spicyPickledGarlic: any = convertToRecipe({
  id: 'spicy-pickled-garlic',
  name: 'Spicy Pickled Garlic',
  ingredients: {
    [items.jalapeno.id]: 2,
    [items.garlic.id]: 5,
  },
  condition: state =>
    (state.itemsSold[items.jalapeno.id] || 0) >= 12 &&
    (state.itemsSold[items.garlic.id] || 0) >= 25,
  recipeType: /** @type {farmhand.recipeType} */ recipeType.KITCHEN,
})

/**
 * @property farmhand.module:recipes.garlicFries

 */
export const garlicFries: any = convertToRecipe({
  id: 'garlic-fries',
  name: 'Garlic Fries',
  ingredients: {
    [items.potato.id]: 5,
    [items.garlic.id]: 3,
    [vegetableOil.id]: 1,
    [salt.id]: 2,
  },
  condition: state =>
    (state.itemsSold[items.potato.id] || 0) >= 50 &&
    (state.itemsSold[items.garlic.id] || 0) >= 30,
  recipeType: /** @type {farmhand.recipeType} */ recipeType.KITCHEN,
})

/**
 * @property farmhand.module:recipes.garlicBread

 */
export const garlicBread: any = convertToRecipe({
  id: 'garlic-bread',
  name: 'Garlic Bread',
  ingredients: {
    [bread.id]: 1,
    [items.garlic.id]: 5,
    [oliveOil.id]: 1,
  },
  condition: state =>
    (state.itemsSold[bread.id] || 0) >= 30 &&
    (state.itemsSold[oliveOil.id] || 0) >= 20 &&
    (state.itemsSold[items.garlic.id] || 0) >= 50,
  recipeType: /** @type {farmhand.recipeType} */ recipeType.KITCHEN,
})

/**
 * @property farmhand.module:recipes.strawberryJam

 */
export const strawberryJam: any = convertToRecipe({
  id: 'strawberry-jam',
  name: 'Strawberry Jam',
  ingredients: {
    [items.strawberry.id]: 10,
  },
  condition: state => (state.itemsSold[items.strawberry.id] || 0) >= 60,
  recipeType: /** @type {farmhand.recipeType} */ recipeType.KITCHEN,
})

/**
 * @property farmhand.module:recipes.popcorn

 */
export const popcorn: any = convertToRecipe({
  id: 'popcorn',
  name: 'Popcorn',
  ingredients: {
    [items.corn.id]: 2,
    [butter.id]: 1,
  },
  condition: state =>
    (state.itemsSold[items.corn.id] || 0) >= 12 &&
    (state.itemsSold[butter.id] || 0) >= 6,
  recipeType: /** @type {farmhand.recipeType} */ recipeType.KITCHEN,
})

/**
 * @property farmhand.module:recipes.pumpkinPie

 */
export const pumpkinPie: any = convertToRecipe({
  id: 'pumpkin-pie',
  name: 'Pumpkin Pie',
  ingredients: {
    [items.pumpkin.id]: 4,
    [items.wheat.id]: 10,
    [butter.id]: 2,
  },
  condition: state =>
    (state.itemsSold[items.pumpkin.id] || 0) >= 200 &&
    (state.itemsSold[items.wheat.id] || 0) >= 250 &&
    (state.itemsSold[butter.id] || 0) >= 75,
  recipeType: /** @type {farmhand.recipeType} */ recipeType.KITCHEN,
})

/**
 * @property farmhand.module:recipes.sweetPotatoPie

 */
export const sweetPotatoPie: any = convertToRecipe({
  id: 'sweet-potato-pie',
  name: 'Sweet Potato Pie',
  ingredients: {
    [items.sweetPotato.id]: 6,
    [items.wheat.id]: 10,
    [butter.id]: 2,
  },
  condition: state =>
    (state.itemsSold[items.sweetPotato.id] || 0) >= 200 &&
    (state.itemsSold[items.wheat.id] || 0) >= 250 &&
    (state.itemsSold[butter.id] || 0) >= 75,
  recipeType: /** @type {farmhand.recipeType} */ recipeType.KITCHEN,
})

/**
 * @property farmhand.module:recipes.sweetPotatoFries

 */
export const sweetPotatoFries: any = convertToRecipe({
  id: 'sweet-potato-fries',
  name: 'Sweet Potato Fries',
  ingredients: {
    [items.sweetPotato.id]: 10,
    [vegetableOil.id]: 1,
    [salt.id]: 1,
  },
  condition: state => (state.itemsSold[items.sweetPotato.id] || 0) >= 100,
  recipeType: /** @type {farmhand.recipeType} */ recipeType.KITCHEN,
})

/**
 * @property farmhand.module:recipes.onionRings

 */
export const onionRings: any = convertToRecipe({
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
    (state.itemsSold[items.onion.id] || 0) >= 50 &&
    (state.itemsSold[vegetableOil.id] || 0) > 20 &&
    (state.itemsSold[soyMilk.id] || 0) > 20 &&
    (state.itemsSold[items.wheat.id] || 0) > 30,
  recipeType: /** @type {farmhand.recipeType} */ recipeType.KITCHEN,
})

/**
 * @property farmhand.module:recipes.bronzeIngot

 */
export const bronzeIngot: any = convertToRecipe({
  id: 'bronze-ingot',
  name: 'Bronze Ingot',
  ingredients: {
    [items.bronzeOre.id]: 5,
    [items.coal.id]: 5,
  },
  condition: state =>
    state.purchasedSmelter > 0 &&
    (state.itemsSold[items.bronzeOre.id] || 0) >= 50,
  recipeType: /** @type {farmhand.recipeType} */ recipeType.FORGE,
})

/**
 * @property farmhand.module:recipes.ironIngot

 */
export const ironIngot: any = convertToRecipe({
  id: 'iron-ingot',
  name: 'Iron Ingot',
  ingredients: {
    [items.ironOre.id]: 5,
    [items.coal.id]: 12,
  },
  condition: state =>
    state.purchasedSmelter > 0 &&
    (state.itemsSold[items.ironOre.id] || 0) >= 50,
  recipeType: /** @type {farmhand.recipeType} */ recipeType.FORGE,
})

/**
 * @property farmhand.module:recipes.silverIngot

 */
export const silverIngot: any = convertToRecipe({
  id: 'silver-ingot',
  name: 'Silver Ingot',
  ingredients: {
    [items.silverOre.id]: 5,
    [items.coal.id]: 8,
  },
  condition: state =>
    state.purchasedSmelter > 0 &&
    (state.itemsSold[items.silverOre.id] || 0) >= 50,
  recipeType: /** @type {farmhand.recipeType} */ recipeType.FORGE,
})

/**
 * @property farmhand.module:recipes.goldIngot

 */
export const goldIngot: any = convertToRecipe({
  id: 'gold-ingot',
  name: 'Gold Ingot',
  ingredients: {
    [items.goldOre.id]: 5,
    [items.coal.id]: 10,
  },
  condition: state =>
    state.purchasedSmelter > 0 &&
    (state.itemsSold[items.goldOre.id] || 0) >= 50,
  recipeType: /** @type {farmhand.recipeType} */ recipeType.FORGE,
})

export const compost = convertToRecipe({
  id: 'compost',
  name: 'Compost',
  ingredients: {
    [items.weed.id]: 25,
  },
  condition: state =>
    state.purchasedComposter > 0 &&
    (state.itemsSold[items.weed.id] || 0) >= 100,
  description: 'Can be used to make fertilizer.',
  recipeType: /** @type {farmhand.recipeType} */ recipeType.RECYCLING,
  type: itemType.CRAFTED_ITEM,
})

/**
 * @property farmhand.module:recipes.fertilizer

 */
export const fertilizer: any = convertToRecipe({
  id: 'fertilizer',
  name: 'Fertilizer',
  ingredients: {
    [compost.id]: 10,
  },
  condition: state =>
    state.purchasedComposter > 0 && (state.itemsSold[compost.id] || 0) >= 10,
  description: 'Helps crops grow and mature a little faster.',
  enablesFieldMode: fieldMode.FERTILIZE,
  recipeType: /** @type {farmhand.recipeType} */ recipeType.RECYCLING,
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
