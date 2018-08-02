// Fixes https://github.com/facebook/jest/issues/4545
require('raf').polyfill(global);

const Adapter = require('enzyme-adapter-react-16');
require('enzyme').configure({ adapter: new Adapter() });
require('babel-register');
