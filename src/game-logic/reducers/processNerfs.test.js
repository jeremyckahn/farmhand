import { applyCrows } from './applyCrows.js'

import { processNerfs } from './processNerfs.js'

vitest.mock('./applyCrows.js')

describe('processNerfs', () => {
  it('invokes applyCrows', () => {
    processNerfs({})

    expect(applyCrows).toHaveBeenCalled()
  })
})
