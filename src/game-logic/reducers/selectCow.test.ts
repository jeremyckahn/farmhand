import { testState } from '../../test-utils/index.ts'
import { generateCow } from '../../utils/index.tsx'

import { selectCow } from './selectCow.ts'

describe('selectCow', () => {
  test('updates selectedCowId', () => {
    const cow = generateCow({ id: 'abc' })
    const { selectedCowId } = selectCow(testState(), cow)
    expect(selectedCowId).toEqual('abc')
  })
})
