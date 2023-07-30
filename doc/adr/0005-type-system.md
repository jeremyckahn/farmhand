# 5. Type system

Date: 2023-07-23

## Status

Accepted

## Context

Farmhand is implemented with JavaScript. Given the size of the codebase, the dynamic nature of JavaScript creates some ambiguity and confusion during development. A type system helps to mitigate these challenges. The ideal type system solution would be a migration to TypeScript, but that is a significant undertaking that would take an outsize amount of effort to complete and get value from. A more approachable solution is to incorporate [Typed JavaScript](https://depth-first.com/articles/2021/11/03/typed-javascript/). Typed JavaScript can be adopted incrementally and does not introduce new syntaxes or tooling needs.

## Decision

Farmhand will transition to using Typed JavaScript. This transition will take a long time and may never be fully completed, but effort should be made to update preexisting code as it modified. Type violations will not be used to break builds until all type violations have been fixed.

## Consequences

- Code will be more clearly and completely documented
- Data type errors will be more obvious
- Improved support for automated refactoring for editors that support such features
- More verbose code
- Many features of TypeScript are unavailable in Typed JavaScript, such as proper enums and interface extension
- Errors will be shown during development in editors that support Typed JavaScript until the code has been updated to be type safe
- The transition may never be complete
- At will be much easier to transition to TypeScript if the transition to Typed JavaScript is ever completed
