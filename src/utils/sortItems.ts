import { sortItemIdsByTypeAndValue } from './sortItemIdsByTypeAndValue.js'

export const sortItems = (
  items: Array<farmhand.item>
): Array<farmhand.item> => {
  const map: Record<string, farmhand.item> = {}
  items.forEach(item => (map[item.id] = item))

  return sortItemIdsByTypeAndValue(items.map(({ id }) => id)).map(id => map[id])
}
