# 1. Use React Testing Library for tests

Date: 2022-04-05

## Status

Accepted

## Context

Since its inception, Farmhand has used [Enzyme](https://enzymejs.github.io/enzyme/) for testing React components. Enzyme has fallen out of favor in the JavaScript community and has been superseded by [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/). Enzyme is also [not compatible with the latest versions of React](https://github.com/enzymejs/enzyme/issues/2429), and [by extension Material UI](https://mui.com/guides/migration-v4/#update-react-amp-typescript-version).

## Decision

Farmhand's test will be gradually rewritten to use React Testing Library. New tests will not be written with Enzyme unless there is an urgent and critical need to do so.

## Consequences

- After the transition, we will be able to upgrade to the latest versions of React and Material UI.
- Our tests will be more resilient by not being so concerned with implementation details.
- The transition will take a lot of time that would otherwise go into feature development and bug fixes.
