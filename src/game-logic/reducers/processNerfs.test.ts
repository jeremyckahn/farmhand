import { testState } from '../../test-utils/index.ts'

import { applyCrows } from './applyCrows.ts'

import { processNerfs } from './processNerfs.ts'

vitest.mock('./applyCrows.ts')

describe('processNerfs', () => {
  it('invokes applyCrows', () => {
    processNerfs(testState())

    expect(applyCrows).toHaveBeenCalled()
  })
})
