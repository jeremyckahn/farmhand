/// <reference types="react-scripts" />

// TODO: Contribute type definitions for 'global' package to
// https://github.com/DefinitelyTyped/DefinitelyTyped
// @see https://github.com/jeremyckahn/farmhand/issues/399
declare module 'global/window' {
  export default window as Window
}
