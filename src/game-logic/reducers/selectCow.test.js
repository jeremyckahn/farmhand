import { selectCow } from './selectCow.js'

describe('selectCow', () => {
  test('updates selectedCowId', () => {
    const { selectedCowId } = selectCow({}, { id: 'abc' })
    expect(selectedCowId).toEqual('abc')
  })
})
