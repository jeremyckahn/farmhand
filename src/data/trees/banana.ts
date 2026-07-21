import { tree, fromSapling } from '../tree.js'
import { treeType } from '../../enums.js'

export const bananaSapling: farmhand.item = tree({
  treeType: treeType.BANANA,
  // First entry is the sapling stage; the remaining 4 map to the 4
  // banana-tree-growing-N art frames before the tree reaches
  // banana-tree-grown. Sums to 20 days (vs. apple's 25) - banana reaches
  // its grown stage a bit faster.
  treeTimeline: [4, 4, 4, 4, 4],
  // How many days the tree stays at banana-tree-grown before it dies
  // (becomes banana-tree-dead) - fruit stops growing at that point, but the
  // tree can still be chopped down for wood.
  lifespan: 200,
  // First entry is a fruit-less period right after planting/picking; the
  // remaining 3 map to the banana-fruit-growing-N frames before the fruit
  // is ready to pick (banana-fruit-grown). Doesn't start advancing until
  // the tree itself reaches its permanent grown state. Sums to 12 days
  // (vs. apple's 6) - banana fruits twice as slowly once grown.
  fruitTimeline: [3, 3, 3, 3],
  growsInto: 'banana',
  id: 'banana-sapling',
  name: 'Banana Sapling',
  tier: 3,
})

export const banana: farmhand.item = tree({
  ...fromSapling(bananaSapling),
  name: 'Banana',
})
