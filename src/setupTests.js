import Adapter from 'enzyme-adapter-react-16'
import 'jest-extended'
import { configure } from 'enzyme'

configure({
  adapter: new Adapter(),
  setupFilesAfterEnv: ['jest-extended'],
})

afterEach(() => {
  jest.restoreAllMocks()
})
