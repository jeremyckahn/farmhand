# 2. One Reducer Per File

Date: 2022-05-14

## Status

Accepted

## Context

Historically, Farmhand's reducers lived in a single `reducers.js` file. This was straightforward, but it grew unmanageably large over time. It became easy to get lost in the file and difficult to comprehend it all.

## Decision

Every "game logic" reducer will be in its own file, and its tests will be in a complementary test file. So, `myCoolReducer.js` will have `myCoolReducer.test.js`.

## Consequences

- Reducer code is easier to understand and maintain.
- Tests run faster.
  - Tests can be split across processor cores better.
  - Fewer tests will have to run in many test watcher workflows.
- The reducer parent directly will become bloated.
- There will be additional redundant boilerplate code across reducer files.
