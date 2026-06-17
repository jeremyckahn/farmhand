import { selectCow } from './selectCow.js'
import { testState } from "../../test-utils/testState.js";
import { generateCow } from "../../utils/generateCow.js";

describe('selectCow', () => {
  test('updates selectedCowId', () => {
    const cow = generateCow({ id: 'abc' })
    const { selectedCowId } = selectCow(testState(), cow)
    expect(selectedCowId).toEqual('abc')
  })
})
