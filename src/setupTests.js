import Adapter from 'enzyme-adapter-react-16';
import { configure } from 'enzyme';

// TODO: Change test from the "getComponent" pattern to leveraging setProps.

configure({ adapter: new Adapter() });

afterEach(() => {
  jest.restoreAllMocks();
});
