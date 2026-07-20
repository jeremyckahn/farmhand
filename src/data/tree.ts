import { itemType } from '../enums.js'

const { freeze } = Object

interface TreeArgs extends Partial<farmhand.item> {
  treeTimeline?: number[]
  fruitTimeline?: number[]
}

const getFruitLifecycleDuration = (fruitTimeline: number[]) =>
  fruitTimeline.reduce((acc, value) => acc + value, 0)

// A sapling's price is pegged to this many fruit-harvest cycles' worth of
// value, rather than to the tree's own (one-time) growth duration: once
// mature, a tree yields fruit repeatedly on the much shorter fruitTimeline
// forever, with no replanting cost, so pricing off treeTimeline wildly
// undervalued it relative to how much it actually pays out over time.
const SAPLING_FRUIT_CYCLES_TO_BREAK_EVEN = 4

export const tree = ({
  treeTimeline = [],
  fruitTimeline = [],
  growsInto,
  tier = 1,
  isSeed = Boolean(growsInto),
  id = '',
  name = '',
  ...rest
}: TreeArgs): farmhand.item => {
  const fruitValue = 10 + getFruitLifecycleDuration(fruitTimeline) * tier * 3

  return freeze({
    id,
    name,
    treeTimeline,
    fruitTimeline,
    doesPriceFluctuate: true,
    tier,
    type: itemType.TREE,
    value: isSeed
      ? fruitValue * SAPLING_FRUIT_CYCLES_TO_BREAK_EVEN
      : fruitValue,
    ...(isSeed && {
      growsInto,
      isPlantableTree: true,
    }),
    ...rest,
  })
}

interface FromSaplingConfig {
  variantIdx?: number
}

export const fromSapling = (
  {
    treeTimeline,
    fruitTimeline,
    treeType,
    growsInto,
    tier = 1,
    lifespan,
  }: farmhand.item,
  { variantIdx = 0 }: FromSaplingConfig = {}
): Partial<farmhand.item> => {
  const variants = Array.isArray(growsInto) ? growsInto : [growsInto]

  return {
    id: variants[variantIdx] || '',
    treeTimeline: treeTimeline || [],
    fruitTimeline: fruitTimeline || [],
    treeType,
    doesPriceFluctuate: true,
    tier,
    type: itemType.TREE,
    lifespan,
  }
}
