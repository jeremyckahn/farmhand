import { cowColors } from '../enums';

export const pixel = require('./pixel.png');

export const plotStates = {
  'watered-plot': require('./plot-states/watered-plot.png'),
  'fertilized-plot': require('./plot-states/fertilized-plot.png'),
};

export const items = {
  // Crops
  carrot: require('./items/carrot.png'),
  'carrot-growing': require('./items/carrot-growing.png'),
  'carrot-seed': require('./items/carrot-seed.png'),

  pumpkin: require('./items/pumpkin.png'),
  'pumpkin-growing': require('./items/pumpkin-growing.png'),
  'pumpkin-seed': require('./items/pumpkin-seed.png'),

  // Field tools
  fertilizer: require('./items/fertilizer.png'),
  scarecrow: require('./items/scarecrow.png'),
  sprinkler: require('./items/sprinkler.png'),

  // Cow items
  'cow-feed': require('./items/cow-feed.png'),
  'milk-1': require('./items/milk-1.png'),
  'milk-2': require('./items/milk-2.png'),
  'milk-3': require('./items/milk-3.png'),
};

export const dishes = {
  'carrot-soup': require('./dishes/carrot-soup.png'),
};

export const tools = {
  hoe: require('./tools/hoe.png'),
  scythe: require('./tools/scythe.png'),
  'watering-can': require('./tools/watering-can.png'),
};

export const animals = {
  cow: Object.values(cowColors).reduce((acc, color) => {
    const lowerCaseColor = color.toLowerCase();
    acc[lowerCaseColor] = require(`./animals/cows/${lowerCaseColor}-cow.png`);
    return acc;
  }, {}),
};
