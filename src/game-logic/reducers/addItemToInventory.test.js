import { addItemToInventory } from './addItemToInventory'
import { INFINITE_STORAGE_LIMIT } from "../../constants";

describe('addItemToInventory', () => {
  test('creates a new item in the inventory', () => {
    expect(
      addItemToInventory(
        { inventory: [], inventoryLimit: INFINITE_STORAGE_LIMIT },
        { id: 'sample-item-1' }
      )
    ).toMatchObject({ inventory: [{ id: 'sample-item-1', quantity: 1 }] })
  })

  test('increments an existing item in the inventory', () => {
    expect(
      addItemToInventory(
        {
          inventory: [{ id: 'sample-item-1', quantity: 1 }],
          inventoryLimit: INFINITE_STORAGE_LIMIT,
        },
        { id: 'sample-item-1' }
      )
    ).toMatchObject({
      inventory: [
        {
          id: 'sample-item-1',
          quantity: 2,
        },
      ],
    })
  })

  describe('there is not enough room in the inventory', () => {
    describe('there is no room for any of the items being added', () => {
      test('no items are added', () => {
        expect(
          addItemToInventory(
            {
              inventory: [{ id: 'sample-item-1', quantity: 3 }],
              inventoryLimit: 3,
            },
            { id: 'sample-item-2' }
          )
        ).toMatchObject({
          inventory: [
            {
              id: 'sample-item-1',
              quantity: 3,
            },
          ],
        })
      })
    })

    describe('there is only room for some of the items being added', () => {
      test('a reduced amount of items are added', () => {
        expect(
          addItemToInventory(
            {
              inventory: [{ id: 'sample-item-1', quantity: 2 }],
              inventoryLimit: 3,
            },
            { id: 'sample-item-2' },
            10
          )
        ).toMatchObject({
          inventory: [
            {
              id: 'sample-item-1',
              quantity: 2,
            },
            {
              id: 'sample-item-2',
              quantity: 1,
            },
          ],
        })
      })
    })

    describe('allowInventoryOverage is true', () => {
      test('all items are added to inventory', () => {
        expect(
          addItemToInventory(
            {
              inventory: [{ id: 'sample-item-1', quantity: 3 }],
              inventoryLimit: 3,
            },
            { id: 'sample-item-2' },
            5,
            true
          )
        ).toMatchObject({
          inventory: [
            {
              id: 'sample-item-1',
              quantity: 3,
            },
            {
              id: 'sample-item-2',
              quantity: 5,
            },
          ],
        })
      })
    })
  })
})
