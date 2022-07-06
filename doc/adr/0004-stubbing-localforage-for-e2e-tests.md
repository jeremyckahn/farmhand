# 4. Stubbing `localforage` for End-to-End Tests

Date: 2022-06-29

## Status

Accepted

## Context

As of https://github.com/jeremyckahn/farmhand/pull/294, `localforage` is now a prop of the `Farmhand` component that defaults to the internally-instantiated `localforage` instance. It enables using the standard bootup logic of the game to be used to populate testing state. Previously, there was an `initialState` prop that was used for setting up `Farmhand` component state for this purpose.

## Decision

For automated end-to-end gameplay tests, a stubbed `localforage` prop should be provided to the `Farmhand` component to define initial state for the sake of automated tests. There is a helper called `saveDataStubFactory` that makes generating save file data easier. Here's an example of how such an end-to-end test may look:

```jsx
test('boots from save file if there is one', async () => {
  const loadedState = saveDataStubFactory({
    dayCount: 10,
  })

  await farmhandStub({
    localforage: {
      getItem: () => Promise.resolve(loadedState),
      setItem: (_key, data) => Promise.resolve(data),
    },
  })

  await waitFor(() => {
    expect(screen.getByText('Day 10', { exact: false })).toBeInTheDocument()
  })
})
```

## Consequences

- Less test-specific logic needs to be implemented in the game.
- The method of defining testing state for end-to-end tests is more abstract and not as straightforward.
