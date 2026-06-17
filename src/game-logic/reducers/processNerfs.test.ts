import { applyCrows } from './applyCrows.js'

import { processNerfs } from './processNerfs.js'
import { testState } from "../../test-utils/testState.js";

vitest.mock('./applyCrows.js')

describe('processNerfs', () => {
  it('invokes applyCrows', () => {
    processNerfs(testState())

    expect(applyCrows).toHaveBeenCalled()
  })
})
