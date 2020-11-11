import { cowColors } from '../enums'

// TODO: Load the images with `import`
// https://create-react-app.dev/docs/adding-images-fonts-and-files/

export { default as pixel } from './pixel.png'

export const plotStates = {
  'watered-plot': require('./plot-states/watered-plot.png').default,
  'fertilized-plot': require('./plot-states/fertilized-plot.png').default,
}

export const craftedItems = {
  'carrot-soup': require('./dishes/carrot-soup.png').default,
  cheese: require('./dishes/cheese.png').default,
  chocolate: require('./dishes/chocolate.png').default,
  jackolantern: require('./items/jackolantern.png').default,
}

export const items = {
  // Crops
  carrot: require('./items/carrot.png').default,
  'carrot-growing': require('./items/carrot-growing.png').default,
  'carrot-seed': require('./items/carrot-seed.png').default,

  pumpkin: require('./items/pumpkin.png').default,
  'pumpkin-growing': require('./items/pumpkin-growing.png').default,
  'pumpkin-seed': require('./items/pumpkin-seed.png').default,

  spinach: require('./items/spinach.png').default,
  'spinach-growing': require('./items/spinach-growing.png').default,
  'spinach-seed': require('./items/spinach-seed.png').default,

  corn: require('./items/corn.png').default,
  'corn-growing': require('./items/corn-growing.png').default,
  'corn-seed': require('./items/corn-seed.png').default,

  potato: require('./items/potato.png').default,
  'potato-growing': require('./items/potato-growing.png').default,
  'potato-seed': require('./items/potato-seed.png').default,

  onion: require('./items/onion.png').default,
  'onion-growing': require('./items/onion-growing.png').default,
  'onion-seed': require('./items/onion-seed.png').default,

  soybean: require('./items/soybean.png').default,
  'soybean-growing': require('./items/soybean-growing.png').default,
  'soybean-seed': require('./items/soybean-seed.png').default,

  wheat: require('./items/wheat.png').default,
  'wheat-growing': require('./items/wheat-growing.png').default,
  'wheat-seed': require('./items/wheat-seed.png').default,

  // Field tools
  fertilizer: require('./items/fertilizer.png').default,
  scarecrow: require('./items/scarecrow.png').default,
  sprinkler: require('./items/sprinkler.png').default,

  // Cow items
  'cow-feed': require('./items/cow-feed.png').default,
  'hugging-machine': require('./items/hugging-machine.png').default,
  'milk-1': require('./items/milk-1.png').default,
  'milk-2': require('./items/milk-2.png').default,
  'milk-3': require('./items/milk-3.png').default,
  'rainbow-milk-1': require('./items/rainbow-milk-1.png').default,
  'rainbow-milk-2': require('./items/rainbow-milk-2.png').default,
  'rainbow-milk-3': require('./items/rainbow-milk-3.png').default,
  'chocolate-milk': require('./items/chocolate-milk.png').default,

  'inventory-box': require('./items/inventory-box.png').default,

  ...craftedItems,
}

export const tools = {
  hoe: require('./tools/hoe.png').default,
  scythe: require('./tools/scythe.png').default,
  'watering-can': require('./tools/watering-can.png').default,
}

export const animals = {
  cow: Object.values(cowColors).reduce((acc, color) => {
    const lowerCaseColor = color.toLowerCase()
    acc[
      lowerCaseColor
    ] = require(`./animals/cows/${lowerCaseColor}-cow.png`).default
    return acc
  }, {}),
}
