import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import './event-handlers';
import './components/farmhand';
import './components/stage';
import './components/inventory';
import './components/shop';
import './components/item';

Enzyme.configure({ adapter: new Adapter() });
