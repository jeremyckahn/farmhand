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

  namespace JSX {
    interface IntrinsicElements {
      'chat-room': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        'root-url'?: string
        room?: string
        'user-id'?: string
        'color-mode'?: string
      }
    }
  }
}
