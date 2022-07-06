import '@testing-library/jest-dom'
import 'jest-extended'
import Adapter from 'enzyme-adapter-react-16'
import { configure } from 'enzyme'

configure({
  adapter: new Adapter(),
  setupFilesAfterEnv: ['jest-extended'],
})

afterEach(() => {
  jest.restoreAllMocks()
})
