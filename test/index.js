import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import './components/farmhand';
import './components/stage';
import './components/inventory';

Enzyme.configure({ adapter: new Adapter() });
