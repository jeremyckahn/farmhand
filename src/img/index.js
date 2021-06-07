import wateredPlot from './plot-states/watered-plot.png'
import fertilizedPlot from './plot-states/fertilized-plot.png'
import rainbowFertilizedPlot from './plot-states/rainbow-fertilized-plot.png'

import bread from './dishes/bread.png'
import burger from './dishes/burger.png'
import butter from './dishes/butter.png'
import carrotSoup from './dishes/carrot-soup.png'
import cheese from './dishes/cheese.png'
import chocolate from './dishes/chocolate.png'
import frenchOnionSoup from './dishes/french-onion-soup.png'
import jackolantern from './items/jackolantern.png'
import rainbowCheese from './dishes/rainbow-cheese.png'
import summerSalad from './dishes/summer-salad.png'
import spaghetti from './dishes/spaghetti.png'

import carrot from './items/carrot.png'
import carrotGrowing from './items/carrot-growing.png'
import carrotSeed from './items/carrot-seed.png'
import pumpkin from './items/pumpkin.png'
import pumpkinGrowing from './items/pumpkin-growing.png'
import pumpkinSeed from './items/pumpkin-seed.png'
import spinach from './items/spinach.png'
import spinachGrowing from './items/spinach-growing.png'
import spinachSeed from './items/spinach-seed.png'
import corn from './items/corn.png'
import cornGrowing from './items/corn-growing.png'
import cornSeed from './items/corn-seed.png'
import potato from './items/potato.png'
import potatoGrowing from './items/potato-growing.png'
import potatoSeed from './items/potato-seed.png'
import onion from './items/onion.png'
import onionGrowing from './items/onion-growing.png'
import onionSeed from './items/onion-seed.png'
import soybean from './items/soybean.png'
import soybeanGrowing from './items/soybean-growing.png'
import soybeanSeed from './items/soybean-seed.png'
import wheat from './items/wheat.png'
import wheatGrowing from './items/wheat-growing.png'
import wheatSeed from './items/wheat-seed.png'
import tomato from './items/tomato.png'
import tomatoGrowing from './items/tomato-growing.png'
import tomatoSeed from './items/tomato-seed.png'
import fertilizer from './items/fertilizer.png'
import rainbowFertilizer from './items/rainbow-fertilizer.png'
import scarecrow from './items/scarecrow.png'
import sprinkler from './items/sprinkler.png'
import cowFeed from './items/cow-feed.png'
import huggingMachine from './items/hugging-machine.png'
import milk1 from './items/milk-1.png'
import milk2 from './items/milk-2.png'
import milk3 from './items/milk-3.png'
import rainbowMilk1 from './items/rainbow-milk-1.png'
import rainbowMilk2 from './items/rainbow-milk-2.png'
import rainbowMilk3 from './items/rainbow-milk-3.png'
import chocolateMilk from './items/chocolate-milk.png'
import inventoryBox from './items/inventory-box.png'
import hoe from './tools/hoe.png'
import scythe from './tools/scythe.png'
import wateringCan from './tools/watering-can.png'

import blueCow from './animals/cows/blue-cow.png'
import brownCow from './animals/cows/brown-cow.png'
import greenCow from './animals/cows/green-cow.png'
import orangeCow from './animals/cows/orange-cow.png'
import purpleCow from './animals/cows/purple-cow.png'
import rainbowCow from './animals/cows/rainbow-cow.png'
import whiteCow from './animals/cows/white-cow.png'
import yellowCow from './animals/cows/yellow-cow.png'

export { default as pixel } from './pixel.png'

export const plotStates = {
  'watered-plot': wateredPlot,
  'fertilized-plot': fertilizedPlot,
  'rainbow-fertilized-plot': rainbowFertilizedPlot,
}

export const craftedItems = {
  'carrot-soup': carrotSoup,
  cheese,
  chocolate,
  bread,
  burger,
  butter,
  'french-onion-soup': frenchOnionSoup,
  jackolantern,
  rainbowCheese,
  spaghetti,
  'summer-salad': summerSalad,
}

export const items = {
  // Crops
  carrot,
  'carrot-growing': carrotGrowing,
  'carrot-seed': carrotSeed,
  pumpkin,
  'pumpkin-growing': pumpkinGrowing,
  'pumpkin-seed': pumpkinSeed,
  spinach,
  'spinach-growing': spinachGrowing,
  'spinach-seed': spinachSeed,
  corn,
  'corn-growing': cornGrowing,
  'corn-seed': cornSeed,
  potato,
  'potato-growing': potatoGrowing,
  'potato-seed': potatoSeed,
  onion,
  'onion-growing': onionGrowing,
  'onion-seed': onionSeed,
  soybean,
  'soybean-growing': soybeanGrowing,
  'soybean-seed': soybeanSeed,
  wheat,
  'wheat-growing': wheatGrowing,
  'wheat-seed': wheatSeed,
  tomato,
  'tomato-growing': tomatoGrowing,
  'tomato-seed': tomatoSeed,

  // Field tools
  fertilizer,
  'rainbow-fertilizer': rainbowFertilizer,
  scarecrow,
  sprinkler,

  // Cow items
  'cow-feed': cowFeed,
  'hugging-machine': huggingMachine,
  'milk-1': milk1,
  'milk-2': milk2,
  'milk-3': milk3,
  'rainbow-milk-1': rainbowMilk1,
  'rainbow-milk-2': rainbowMilk2,
  'rainbow-milk-3': rainbowMilk3,
  'chocolate-milk': chocolateMilk,

  'inventory-box': inventoryBox,

  ...craftedItems,
}

export const tools = {
  hoe,
  scythe,
  'watering-can': wateringCan,
}

export const animals = {
  cow: {
    blue: blueCow,
    brown: brownCow,
    green: greenCow,
    orange: orangeCow,
    purple: purpleCow,
    rainbow: rainbowCow,
    white: whiteCow,
    yellow: yellowCow,
  },
}
