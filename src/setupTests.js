import '@testing-library/jest-dom'
import 'jest-extended'
import Adapter from 'enzyme-adapter-react-16'
import { configure } from 'enzyme'

configure({
  adapter: new Adapter(),
  setupFilesAfterEnv: ['jest-extended'],
})

beforeEach(() => {
  // Return an invalid month number so that any conditional logic that depends
  // on a specific month is not run in tests (unless getMonth is re-mocked).
  vitest.spyOn(Date.prototype, 'getMonth').mockReturnValue(-1)
})
