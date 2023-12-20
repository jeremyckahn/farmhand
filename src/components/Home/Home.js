import React from 'react'

import { func, object } from 'prop-types'
import ReactMarkdown from 'react-markdown'
import window from 'global/window'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'

import { items } from '../../img'

import { achievementsMap } from '../../data/achievements'
import FarmhandContext from '../Farmhand/Farmhand.context'
import { STANDARD_LOAN_AMOUNT } from '../../constants'
import { stageFocusType } from '../../enums'
import { isDecember } from '../../utils'
import { memoize } from '../../utils/memoize'
import Achievement from '../Achievement'

import { SnowBackground } from './SnowBackground'
import './Home.sass'

const onboardingAchievements = [
  achievementsMap['plant-crop'],
  achievementsMap['water-crop'],
  achievementsMap['harvest-crop'],
  achievementsMap['purchase-cow-pen'],
]

const getRemainingOnboardingAchievements = memoize(completedAchievements =>
  onboardingAchievements.filter(
    achievement => achievement && !completedAchievements[achievement.id]
  )
)

const environmentAllowsInstall = ['production', 'development'].includes(
  process.env.NODE_ENV
)

const VALID_ORIGINS = [
  'https://jeremyckahn.github.io',
  'https://www.farmhand.life',
  'http://localhost:3000',
]

// https://stackoverflow.com/questions/41742390/javascript-to-check-if-pwa-or-mobile-web/41749865#41749865
const isInstallable =
  environmentAllowsInstall &&
  !window.matchMedia('(display-mode: standalone)').matches &&
  VALID_ORIGINS.includes(window.location.origin)

const Home = ({
  completedAchievements,
  handleViewChangeButtonClick,

  remainingOnboardingAchievements = getRemainingOnboardingAchievements(
    completedAchievements
  ),
}) => (
  <div className="Home">
    {isDecember() ? (
      <>
        <SnowBackground />
        <h1 className="holiday-greeting">
          Happy holidays!{' '}
          <span role="img" aria-label="Snowman">
            ⛄️
          </span>
        </h1>
      </>
    ) : (
      <h1>Welcome!</h1>
    )}
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <h2>Click to read a note from the developer</h2>
      </AccordionSummary>
      <AccordionDetails>
        <ReactMarkdown
          {...{
            linkTarget: '_blank',
            className: 'markdown',
            source: `
Hi, you're playing **Farmhand**! This is an open source game project created by [Jeremy Kahn](https://github.com/jeremyckahn). The project has evolved over time and is now developed with the support of [a community of contributors](https://github.com/jeremyckahn/farmhand/blob/develop/CONTRIBUTORS.md).

[![Source code](https://badgen.net/badge/icon/github?icon=github&label)](https://github.com/jeremyckahn/farmhand) [![Discord](https://img.shields.io/discord/714539345050075176?label=farmhand+discord)](https://discord.gg/6cHEZ9H) [![r/FarmhandGame](https://img.shields.io/reddit/subreddit-subscribers/FarmhandGame?style=social)](https://www.reddit.com/r/FarmhandGame/) [![@FarmhandGame](https://img.shields.io/badge/@farmhandgame-E4405F?style=flat-square&logo=Instagram&logoColor=white)](https://www.instagram.com/farmhandgame/)

Farmhand is a resource management game that puts a farm in your hand. It is designed to be both desktop and mobile-friendly and fun for 30 seconds or 30 minutes at a time. Can you build a thriving farming business? Give it a try and find out!

This project has been in development since 2018. **Farmhand will always remain completely free to play**. The game is continually being developed and new features are released as soon as they are ready. All are welcomed to participate in the game's development, so [join the Discord channel](https://discord.gg/6cHEZ9H) and say hi if you'd like to get involved!

Farmhand is developed in a fully transparent way. As much of its development and operation is as publicly accessible as possible, including [API deployment logs](https://farmhand.vercel.app/_logs), [build job logs](https://github.com/jeremyckahn/farmhand/actions), and [deployed static assets](https://github.com/jeremyckahn/farmhand/tree/gh-pages). Your privacy is important, so none of your personal information is collected or transmitted aside from basic Google Analytics data tracking. You're welcome to audit the code, logs, and network requests to verify it for yourself. Farmhand's code is licensed under [GNU GPL v2](https://www.gnu.org/licenses/old-licenses/gpl-2.0.en.html), and all game art is licensed under [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode).

Happy farming! 🐮
    `,
          }}
        />
      </AccordionDetails>
    </Accordion>
    <Divider />
    <Card>
      <CardContent>
        <ReactMarkdown
          {...{
            className: 'markdown',
            linkTarget: '_blank',
            source: `
### How to play

The goal of Farmhand is to make money by buying, growing, harvesting, and then selling crops. Keep an eye on prices though, because they go up and down every day! The best farmers buy seeds for a low price and sell them for a high price.

If you can master the art of the harvest, there's no limit to how profitable you can become! Every farmer starts with a $${STANDARD_LOAN_AMOUNT} loan from the bank. If you run out of money, you can always take out another loan. Be careful though, because the bank takes a portion of your sales until the debt is repaid. You can access your bank account in the menu.
    `,
          }}
        />
        {remainingOnboardingAchievements.length ? (
          <>
            <ReactMarkdown
              {...{
                className: 'markdown',
                linkTarget: '_blank',
                source: `
### Getting started

It looks like you're new here. Thanks for stopping by! Here are some goals to help you get familiar with the game.
    `,
              }}
            />
            <ul className="card-list">
              {remainingOnboardingAchievements.map(achievement => (
                <li {...{ key: achievement.id }}>
                  <Achievement {...{ achievement }} />
                </li>
              ))}
            </ul>
          </>
        ) : null}
        <Button
          {...{
            color: 'primary',
            onClick: () => handleViewChangeButtonClick(stageFocusType.SHOP),
            variant: 'contained',
          }}
        >
          Go to the shop
        </Button>
      </CardContent>
    </Card>
    <Divider />
    <Card>
      <CardContent>
        <ReactMarkdown
          {...{
            className: 'markdown',
            linkTarget: '_blank',
            source: `
### ![Animated Scarecrow](${items['scarecrow-animated']}) Looking for more farming fun? ![Animated Scarecrow](${items['scarecrow-animated']})

The Farmhand team has another game for you to play: **Farmhand Go!** You can [try it for free online](https://rainbowcow-studio.itch.io/farmhand-go) and support the developers by [purchasing it on Steam](https://store.steampowered.com/app/2080880/Farmhand_Go/).

**Farmhand Go!** is a complementary game to the one you're playing right now. It's a more active take on the Farmhand concept, with days passing in real time and crows that you need to click or tap to defend against. If you like growing, harvesting, and selling crops in Farmhand, you're going to love **Farmhand Go!**

The Farmhand game you're playing now is still under active development, so don't be concerned about it being abandonded by the team. We just love exploring new ideas and making fun games!
    `,
          }}
        />
      </CardContent>
    </Card>
    <Divider />
    <Card>
      <CardContent>
        <ReactMarkdown
          {...{
            className: 'markdown',
            linkTarget: '_blank',
            source: `
### Official merchandise

You can support Farmhand's ongoing development by purchasing [official merchandise](https://www.zazzle.com/store/farmhandgame/products)! This also spreads awareness of the game and makes every day a little brighter.
    `,
          }}
        />
      </CardContent>
    </Card>
    <Divider />
    <Card>
      <CardContent>
        <ReactMarkdown
          {...{
            className: 'markdown',
            linkTarget: '_blank',
            source: `
### Online multiplayer

You can play Farmhand online with others! Online play is totally free and anonymous.

To play online, flip the "Play online" toggle in the menu. You'll be connected to the **global** room by default, but you can select another room to play in if you'd like. If you select a room that doesn't exist, it will automatically be created for you. You can then tell others to meet you in that room.

Online play works just like offline play, except that the fluctuating market values are shared among everyone playing in the room with you. Additionally, market values are affected by your choices when you end a farm day:

* Buying seeds or harvesting crops raises their respective values

* Selling items (seeds or harvested crops) or harvesting seeds lowers their respective values

You'll see a notification explaining how you affected the market when you end the farm day. Because room market values are shared, **your buy/sell/harvest decisions affect others** when they join the room or end their farm day. Time your actions right to take advantage of market trends and gain the competitive edge over other online farmers!

As an added bonus for playing online, **you'll get free money** a few times every minute while connected to a room. The more people that are connected, the more you'll get. Invite your friends to the room and to increase the bonus for everyone!
    `,
          }}
        />
      </CardContent>
    </Card>
    <Divider />
    {isInstallable && (
      <>
        <Card>
          <CardContent>
            <ReactMarkdown
              {...{
                className: 'markdown',
                linkTarget: '_blank',
                source: `
### Installation

Farmhand can be installed to your device right from this web page! Once installed, the game can be played with or without an internet connection.

If you're playing on a mobile device, all you need to do is [add it to your home screen](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Installing#add_to_home_screen). If you're playing it on desktop Chrome or Microsoft Edge, [you can install it as an app there as well](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Installing#installing_pwas).
    `,
              }}
            />
          </CardContent>
        </Card>
        <Divider />
      </>
    )}
    <Card>
      <CardContent>
        <ReactMarkdown
          {...{
            className: 'markdown',
            linkTarget: '_blank',
            source: `
### A few other tips

* Press the bed button in the top-right of the screen to end the farm day and advance the game. This also saves your progress.

* Crops need to be watered daily to grow.

* Keep the field free of weeds with the scythe or the hoe.

* Crafting items out of harvested crops in the Workshop is an excellent way to make money!

* Purchasing a cow pen will allow you to buy, sell, milk, and breed cows. Can you breed the mythical Rainbow Cow?

* Put up a scarecrow to protect your field!

* Watch your inventory space as you obtain items. You can purchase additional Storage Units in the shop.

* You'll be able to unlock new crops and items as you level up. Sell crops, milk, and crafted items to gain experience!

* Bank loans accrue interest daily, so pay off your balance as soon as you can.

* Press "Shift + ?" to see all of the keyboard shortcuts available to you.

    `,
          }}
        />
      </CardContent>
    </Card>
  </div>
)

Home.propTypes = {
  completedAchievements: object.isRequired,
  handleViewChangeButtonClick: func.isRequired,
}

export default function Consumer(props) {
  return (
    <FarmhandContext.Consumer>
      {({ gameState, handlers }) => (
        <Home {...{ ...gameState, ...handlers, ...props }} />
      )}
    </FarmhandContext.Consumer>
  )
}
