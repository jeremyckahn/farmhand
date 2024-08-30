import { applyCrows } from './applyCrows'

import { processNerfs } from './processNerfs'

vitest.mock('./applyCrows')

describe('processNerfs', () => {
  it('invokes applyCrows', () => {
    processNerfs({})

    expect(applyCrows).toHaveBeenCalled()
  })
})
