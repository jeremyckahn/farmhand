## Current Progress

This is an old document that is mostly here as a record of the features that have been implemented so far. You can get a more up-to-date view of the game's development progress [here](https://github.com/jeremyckahn/farmhand/projects/1).

## Milestone 6: Bank Loans 🏦

- [x] Accounting modal + trigger
- [x] Loan section
  - [x] Outstanding balance display
  - [x] Button to take out \$500 loan
  - [x] UI to pay down loan
  - [x] Explanation of loan terms
- [x] 5% of all crop and milk sales automatically go into loan paydown
- [x] Money owed on loan increases by 2% every day
- [x] Game starts off with \$500 loan

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
