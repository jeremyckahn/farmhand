import { INFINITE_STORAGE_LIMIT } from '../../constants.js'
import { itemStub } from '../../test-utils/stubs/itemStub.js'
import { saveDataStubFactory } from '../../test-utils/stubs/saveDataStubFactory.js'

import { addItemToInventory } from './addItemToInventory.js'

const sampleItem1 = itemStub({ id: 'sample-item-1' })
const sampleItem2 = itemStub({ id: 'sample-item-2' })

describe('addItemToInventory', () => {
  test('creates a new item in the inventory', () => {
    expect(
      addItemToInventory(
        saveDataStubFactory({
          inventory: [],
          inventoryLimit: INFINITE_STORAGE_LIMIT,
        }),
        sampleItem1
      )
    ).toMatchObject({ inventory: [{ id: 'sample-item-1', quantity: 1 }] })
  })

  test('increments an existing item in the inventory', () => {
    expect(
      addItemToInventory(
        saveDataStubFactory({
          inventory: [{ id: 'sample-item-1', quantity: 1 }],
          inventoryLimit: INFINITE_STORAGE_LIMIT,
        }),
        sampleItem1
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
            saveDataStubFactory({
              inventory: [{ id: 'sample-item-1', quantity: 3 }],
              inventoryLimit: 3,
            }),
            sampleItem2
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
            saveDataStubFactory({
              inventory: [{ id: 'sample-item-1', quantity: 2 }],
              inventoryLimit: 3,
            }),
            sampleItem2,
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
            saveDataStubFactory({
              inventory: [{ id: 'sample-item-1', quantity: 3 }],
              inventoryLimit: 3,
            }),
            sampleItem2,
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
