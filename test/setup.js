import raf from 'raf';

// Fixes https://github.com/facebook/jest/issues/4545
raf.polyfill(global);
