import '@testing-library/jest-dom'
import 'jest-extended'
import { cleanup } from '@testing-library/react'

beforeEach(() => {
  // Return an invalid month number so that any conditional logic that depends
  // on a specific month is not run in tests (unless getMonth is re-mocked).
  vitest.spyOn(Date.prototype, 'getMonth').mockReturnValue(-1)
})

afterEach(() => {
  cleanup()
})
