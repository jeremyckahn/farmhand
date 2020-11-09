import { cowColors } from '../enums'

export const pixel = require('./pixel.png')

export const plotStates = {
  'watered-plot': require('./plot-states/watered-plot.png'),
  'fertilized-plot': require('./plot-states/fertilized-plot.png'),
}

export const craftedItems = {
  'carrot-soup': require('./dishes/carrot-soup.png'),
  cheese: require('./dishes/cheese.png'),
  jackolantern: require('./items/jackolantern.png'),
}

export const items = {
  // Crops
  carrot: require('./items/carrot.png'),
  'carrot-growing': require('./items/carrot-growing.png'),
  'carrot-seed': require('./items/carrot-seed.png'),

  pumpkin: require('./items/pumpkin.png'),
  'pumpkin-growing': require('./items/pumpkin-growing.png'),
  'pumpkin-seed': require('./items/pumpkin-seed.png'),

  spinach: require('./items/spinach.png'),
  'spinach-growing': require('./items/spinach-growing.png'),
  'spinach-seed': require('./items/spinach-seed.png'),

  corn: require('./items/corn.png'),
  'corn-growing': require('./items/corn-growing.png'),
  'corn-seed': require('./items/corn-seed.png'),

  potato: require('./items/potato.png'),
  'potato-growing': require('./items/potato-growing.png'),
  'potato-seed': require('./items/potato-seed.png'),

  onion: require('./items/onion.png'),
  'onion-growing': require('./items/onion-growing.png'),
  'onion-seed': require('./items/onion-seed.png'),

  soybean: require('./items/soybean.png'),
  'soybean-growing': require('./items/soybean-growing.png'),
  'soybean-seed': require('./items/soybean-seed.png'),

  // Field tools
  fertilizer: require('./items/fertilizer.png'),
  scarecrow: require('./items/scarecrow.png'),
  sprinkler: require('./items/sprinkler.png'),

  // Cow items
  'cow-feed': require('./items/cow-feed.png'),
  'hugging-machine': require('./items/hugging-machine.png'),
  'milk-1': require('./items/milk-1.png'),
  'milk-2': require('./items/milk-2.png'),
  'milk-3': require('./items/milk-3.png'),
  'rainbow-milk-1': require('./items/rainbow-milk-1.png'),
  'rainbow-milk-2': require('./items/rainbow-milk-2.png'),
  'rainbow-milk-3': require('./items/rainbow-milk-3.png'),
  'chocolate-milk': require('./items/chocolate-milk.png'),

  'inventory-box': require('./items/inventory-box.png'),

  ...craftedItems,
}

export const tools = {
  hoe: require('./tools/hoe.png'),
  scythe: require('./tools/scythe.png'),
  'watering-can': require('./tools/watering-can.png'),
}

export const animals = {
  cow: Object.values(cowColors).reduce((acc, color) => {
    const lowerCaseColor = color.toLowerCase()
    acc[lowerCaseColor] = require(`./animals/cows/${lowerCaseColor}-cow.png`)
    return acc
  }, {}),
}
