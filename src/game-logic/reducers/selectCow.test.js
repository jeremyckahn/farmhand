import { testState } from '../../test-utils/index.js'
import { generateCow } from '../../utils/index.js'

import { selectCow } from './selectCow.js'

describe('selectCow', () => {
  test('updates selectedCowId', () => {
    const cow = generateCow({ id: 'abc' })
    const { selectedCowId } = selectCow(testState(), cow)
    expect(selectedCowId).toEqual('abc')
  })
})
