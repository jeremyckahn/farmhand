import { testState } from '../../test-utils/index.js'

import { selectCow } from './selectCow.js'

describe('selectCow', () => {
  test('updates selectedCowId', () => {
    const { selectedCowId } = selectCow(testState(), { id: 'abc' })
    expect(selectedCowId).toEqual('abc')
  })
})
