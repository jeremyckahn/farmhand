import { testState } from '../../test-utils/index.js'

import { applyCrows } from './applyCrows.js'

import { processNerfs } from './processNerfs.js'

vitest.mock('./applyCrows.js')

describe('processNerfs', () => {
  it('invokes applyCrows', () => {
    processNerfs(testState())

    expect(applyCrows).toHaveBeenCalled()
  })
})
