# 6. Fully-resolved Module Paths

Date: 2024-09-02

## Status

Accepted

## Context

Farmhand's Vercel-based API code imports a subset of the browser-based game code in order to function. The browser code is processed by Vite at build time and therefore doesn't require fully-resolved module paths. So, this would be a valid import:

```js
import Farmhand from './components/Farmhand'
```

Which would resolve to `./components/Farmhand/index.js`. However, Vercel executes serverless function code as raw, [standard ES6 modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) via Node. So, code with shorthand paths such as this break the Vercel API. Fully-resolved import paths that look like this work in both environments:

```js
import Farmhand from './components/Farmhand/index.js'
```

---

See:

- https://github.com/jeremyckahn/farmhand/pull/506 (reverted)
- https://github.com/jeremyckahn/farmhand/pull/509 (contains #506 along with fixes)

## Decision

In order to keep code compatible with both client-side web app and the server-side API, modules paths must be fully resolved. So, they must include the trailing `.js` file extension.

## Consequences

- Code can be consumed by both Vite for the web app and Node in Vercel for the server API
- Module paths are more verbose and less flexible
