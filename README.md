# Farmhand

### A farming game

**[Current snapshot](https://jeremyckahn.github.io/farmhand/)**

- `master`: [![Build Status](https://travis-ci.org/jeremyckahn/farmhand.svg?branch=master)](https://travis-ci.org/jeremyckahn/farmhand)
- `develop`: [![Build Status](https://travis-ci.org/jeremyckahn/farmhand.svg?branch=develop)](https://travis-ci.org/jeremyckahn/farmhand)

This is an open source farming game built with web technologies. Some basic ideas are implemented and stable, but currently this is far from being a "game." It's in a proof-of-concept state and will likely be there for some time. I am working on this entirely solo in my free time and am challenging myself to build it with strictly open development tools (aside from hardware and operating systems). I am designing this game such that it would be fun for anyone that is into resource management and farming games, but ultimately my goal to make the game that I wish existed. And I want to have fun doing it! 🙂

## Branch structure

- Active development takes place in `develop`.
- `master` is updated when `develop` is stable.
- `gh-pages` contains the built assets and is updated automatically when `master` is updated.

There is no release or versioning system yet.

## Milestone 2: Cows!

### Tasks

- [ ] Purchase cow pen
  - [ ] Three sizes
- [ ] Purchase cows
- [ ] Cow status in context pane
  - [ ] Rename cow
  - [ ] Show stats
    - [ ] Age
    - [ ] Happiness (measured in hearts)
    - [ ] Weight
- [ ] Cow pen UI
  - [ ] Cows walking around
  - [ ] Click/tap to select cow
  - [ ] Cycle through cows with arrows
- [ ] Purchase growable grain seeds
- [ ] Purchase grown grain for a premium
- [ ] Cow milking
  - [ ] Cows can be milked once a day
  - [ ] Happiness improves milk quality
  - [ ] Weight improves milk quantity
  - [ ] Milk quantity and quality decrease after a certain age
- [ ] Milk items
  - [ ] Three quality levels
- [ ] Cow care
  - [ ] Feeding grain increases weight
  - [ ] Hugging cows improves happiness (benefits top out after 3 daily hugs)
- [ ] Selling cows for beef
  - [ ] Greater weight results in higher sell value
  - [ ] Older cows are worth less
- [ ] Negligence
  - [ ] Not feeding cows causes them to lose weight
  - [ ] Cows die after becoming too underweight

## Milestone 1 tasks

- [x] Stand up basic layout
  - [x] Info/detail pane
  - [x] Field grid
- [x] [Local](https://github.com/localForage/localForage) saves
- [x] Day cycle
  - [x] Weather
    - [x] Rain
  - [x] Nerfs
    - [x] Crows
- [x] Commerce
  - [x] Store
    - [x] Buy
    - [x] Sell
  - [x] Fluctuating prices for produce and seeds
- [x] Crop lifecycle
  - [x] 1. Planted
  - [x] 2. Germinating
  - [x] 3. Grown
- [x] Crop tending
  - [x] Planting
  - [x] Watering
  - [x] Harvesting
  - [x] Removal
- [x] Tools/items
  - [x] Fertilizer
  - [x] Sprinklers
  - [x] Scarecrows
  - [x] Bigger field
- ~~[ ] Request financial aid~~ This could be obviated by a buff system to come in a later milestone.

## Project overview

This project is built with [Create React App](https://facebook.github.io/create-react-app/)), so please refer to the documentation of that project to learn the development toolchain.

## Documentation

Please update the [JSDoc](http://usejsdoc.org/) annotations as you work. To view the formatted documentation in your browser:

```
npm run doc
npm run doc:view
```

This will generate the docs and run them in your browser. If you would like this to update automatically as you work, run this task:

```
npm run doc:live
```

## Versioned releases

npm makes it super easy to make versioned releases! This project is set up to run tests before making a release, which helps prevent you from releasing new versions with bugs. This happens automatically thanks to the [npm version scripts](https://docs.npmjs.com/cli/version).

```
npm version patch # Or "minor," or "major"
```

This will also use the [gh-pages](https://github.com/tschaub/gh-pages) utility to deploy your versioned project with [GitHub Pages](https://pages.github.com/).

## License

[CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode).
