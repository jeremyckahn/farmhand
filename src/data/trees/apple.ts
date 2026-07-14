import { tree, fromSapling } from '../tree.js'
import { treeType } from '../../enums.js'

export const appleSapling: farmhand.item = tree({
  treeType: treeType.APPLE,
  // First entry is the sapling stage; the remaining 4 map to the 4
  // apple-growing-N art frames before the tree reaches apple-grown, which
  // it then stays at permanently.
  treeTimeline: [5, 5, 5, 5, 5],
  // First entry is a fruit-less period right after planting/picking; the
  // remaining 2 map to the apple-fruit-growing-N frames before the fruit
  // is ready to pick (apple-fruit-grown). Doesn't start advancing until
  // the tree itself reaches its permanent grown state.
  fruitTimeline: [2, 2, 2],
  growsInto: 'apple',
  id: 'apple-sapling',
  name: 'Apple Sapling',
  tier: 2,
})

export const apple: farmhand.item = tree({
  ...fromSapling(appleSapling),
  name: 'Apple',
})
