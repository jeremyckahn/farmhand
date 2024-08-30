/// <reference types="react-scripts" />

import Farmhand from './components/Farmhand'

// TODO: Contribute type definitions for 'global' package to
// https://github.com/DefinitelyTyped/DefinitelyTyped
// @see https://github.com/jeremyckahn/farmhand/issues/399
declare module 'global/window' {
  export default window as Window
}

declare global {
  interface Window {
    farmhand?: typeof Farmhand
  }
}
