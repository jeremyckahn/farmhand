import Adapter from 'enzyme-adapter-react-16';
import { configure } from 'enzyme';

configure({ adapter: new Adapter() });

// TODO: Convert "it" to "test"

afterEach(() => {
  jest.restoreAllMocks();
});
