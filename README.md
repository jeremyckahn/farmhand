# Farmhand

### A farming game

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
