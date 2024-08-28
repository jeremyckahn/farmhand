import '@testing-library/jest-dom'
import 'jest-extended'
import Adapter from 'enzyme-adapter-react-16'
import { configure } from 'enzyme'
import { cleanup } from '@testing-library/react'

configure({
  adapter: new Adapter(),
})

beforeEach(() => {
  // Return an invalid month number so that any conditional logic that depends
  // on a specific month is not run in tests (unless getMonth is re-mocked).
  vitest.spyOn(Date.prototype, 'getMonth').mockReturnValue(-1)
})

afterEach(() => {
  cleanup()
})
