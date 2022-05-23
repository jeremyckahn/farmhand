# Farmhand Smoke Test Checklist

This is a high-level checklist for things to test in Farmhand to ensure there are no regressions. Check off each item once you have manually tested it and verified that it works correctly. You don't need to check off every item here, but the more that's tested, the more stable we know the game is!

## Preparation

- Start a new game (this can be easily done with a Private Browsing or Incognito browser window)
- **Optional**: To make testing easier, feel free to load the game save file at `./saves/lots-of-money.json`. This will give you \$1,000,000 so you can test all of the features more quickly.

## Basic features

- [ ] Can purchase seeds from shop
- [ ] Can sell items
- [ ] Can end the day
- [ ] Reloading the page resumes the game in progress since the last save
- [ ] Can purchase storage upgrades
- [ ] Can't store more than storage limit (except via achievement rewards)
- [ ] Can level up
- [ ] Can pay off loan

## The field

- [ ] Can plant a seed
- [ ] Can plant seeds with different range settings
- [ ] Can water seeds
- [ ] Empty plots don't get watered
- [ ] Can harvest grown crops
- [ ] Can hoe seeds

## Cows

- [ ] Can purchase cow pen
- [ ] Can purchase cows
- [ ] Can hug cows
- [ ] Cannot have more cows than cow pen allows
- [ ] Can breed Rainbow Cow
- [ ] Can breed cows
- [ ] Cow offspring have correct traits

## Recipes

- [ ] Recipes unlock from selling crops (such as Carrot Soup)
- [ ] Can craft recipes

## Mining

- [ ] Can dig empty plots with the shovel
- [ ] Plots with crops don't get shoveled
- [ ] Can craft ores

## Upgrades

- [ ] Combine auto harvests crops
- [ ] Shovel unlocks at level 6
- [ ] Can purchase smelter
- [ ] Can craft tool upgrades

## Online features

- [ ] Can connect to online room
- [ ] Can disconnect from online room
- [ ] Can offer cow for trade
