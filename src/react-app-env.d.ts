import Farmhand from './components/Farmhand/index.js'

// TODO: Contribute type definitions for 'global' package to
// https://github.com/DefinitelyTyped/DefinitelyTyped
// @see https://github.com/jeremyckahn/farmhand/issues/399
declare module 'global/window.js' {
  export default window as Window
}

declare global {
  interface Window {
    farmhand?: typeof Farmhand
  }
}
