# Farmhand

### A farming game

Discord link: [![Discord](https://img.shields.io/discord/714539345050075176?label=farmhand)](https://discord.gg/6cHEZ9H)

**[Current snapshot](https://jeremyckahn.github.io/farmhand/)**

- `master`: [![Build Status](https://travis-ci.org/jeremyckahn/farmhand.svg?branch=master)](https://travis-ci.org/jeremyckahn/farmhand)
- `develop`: [![Build Status](https://travis-ci.org/jeremyckahn/farmhand.svg?branch=develop)](https://travis-ci.org/jeremyckahn/farmhand)

This is an open source farming game built with web technologies. Some basic ideas are implemented and stable, but currently this is far from being a "game." It's in a proof-of-concept state and will likely be there for some time. I am working on this entirely solo in my free time and am challenging myself to build it with strictly open development tools (aside from hardware and operating systems). I am designing this game such that it would be fun for anyone that is into resource management and farming games, but ultimately my goal to make the game that I wish existed. And I want to have fun doing it! 🙂

## Branch structure

- Active development takes place in `develop`.
- `master` is updated when `develop` is stable.
- `gh-pages` contains the built assets and is updated automatically when `master` is updated.

There is no release or versioning system yet.

## Milestone 6: Bank Loans 🏦

- [ ] Accounting modal + trigger
- [ ] Loan section
  - [ ] Outstanding balance display
  - [ ] Button to take out \$500 loan
  - [ ] UI to pay down loan
  - [ ] Explanation of loan terms
- [ ] 5% of all crop sales automatically go into loan paydown
- [ ] Money owed on loan increases by 2% every day
- [ ] Game starts off with \$500 loan

## Milestone 5: Achievements 🏅

- [x] Achievements modal + trigger
- [x] Achievements card
  - [x] Name/description
  - [x] Reward
- [x] Achievements
  - [x] Conditions
  - [x] Reward
  - [x] Show a notification upon completion
- [x] Initial achievements
  - [x] Every step of the harvest cycle (plant, harvest, sell)
  - [x] Unlock crop price guide by making \$10,000
  - [x] Buy every color of cow (get cow feed as a reward)

## Milestone 4: Events 🗓

- [x] Stand up Home view
  - [x] Past daily notifications are accessible from the last 14 days
- [x] Crop value events (particular crops are worth a modified value for a period of time)
  - [x] Surges
  - [x] Crashes

## Milestone 3: Cooking 🥘

- [x] Stand up basic cooking pane UI
- [x] Cook recipes
  - [x] Cooked dishes are added to inventory to be sold for flat price
- [x] Learn new recipes
  - [x] Recipes are learned when certain farming goals are met (such as growing enough carrots)

## Milestone 2: Cows!

### Tasks

- [x] Purchase cow pen
  - [x] Three sizes
- [x] Generate and purchase cows
  - [x] Multiple cow colors (every color of the rainbow)
  - [x] Cows can be male or female
  - [x] Male cows weigh more than females
- [x] Cow status in context pane
  - [x] Rename cow
  - [x] Show stats
    - [x] Age
    - [x] Happiness (measured in hearts)
    - [x] Weight
- [x] Cow pen UI
  - [x] Cows walking around
  - [x] Click/tap to select cow
  - [x] Tooltip info appears over cow when selected
- [x] Purchase cow feed (10 units at a time)
- [x] Cow milking
  - [x] Female cows can be milked every several days
  - [x] Happiness improves milk quality
  - [x] Weight improves milk production day frequency
  - ~~[ ] Milk quantity and quality decrease after a certain age~~
- [x] Milk items
  - [x] Three quality levels
- [x] Cow care
  - [x] Keeping cow feed stocked increases weight
  - [x] Cows automatically eat one unit of feed a day
  - [x] Hugging cows improves happiness (benefits top out after 3 daily hugs)
- [x] Selling cows
  - [x] Greater weight results in higher sell value
  - [x] Older cows are worth less
- [x] Negligence
  - [x] Not keeping cow feed stocked causes cows to lose weight
- ~~[ ] Breeding~~ This should be considered for a later milestone.
  - ~~[ ] Happy male/female cow pairs will randomly produce offspring if there is room in the pen~~

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
