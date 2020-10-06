import React from 'react'
import { func } from 'prop-types'
import ReactMarkdown from 'react-markdown'
import Button from '@material-ui/core/Button'
import Divider from '@material-ui/core/Divider'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'

import FarmhandContext from '../../Farmhand.context'
import { STANDARD_LOAN_AMOUNT } from '../../constants'
import { stageFocusType } from '../../enums'

import './Home.sass'

const Home = ({ handleViewChangeButtonClick }) => (
  <div className="Home">
    <h1>Welcome!</h1>
    <ExpansionPanel>
      <ExpansionPanelSummary>
        <h2>A note from the developer</h2>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        <ReactMarkdown
          {...{
            linkTarget: '_blank',
            className: 'markdown',
            source: `
Hi! You're playing Farmhand, an open source game being developed by [Jeremy Kahn](https://github.com/jeremyckahn). The game is currently smack dab in the middle of development, so it is **very incomplete and unpolished**. However, you're welcome to try out what's already here!

This is a resource management game that puts a farm in your hand. It is designed to be mobile-friendly and fun for 30 seconds or 30 minutes at a time. Give it a try!

If you'd like to follow this project's development, please [join the Discord channel](https://discord.gg/6cHEZ9H), [the subreddit](https://www.reddit.com/r/FarmhandGame/), or check it out on [GitHub](https://github.com/jeremyckahn/farmhand). Happy farming! 🐮
    `,
          }}
        />
      </ExpansionPanelDetails>
    </ExpansionPanel>
    <Divider />
    <Button
      {...{
        color: 'primary',
        onClick: () => handleViewChangeButtonClick(stageFocusType.SHOP),
        variant: 'contained',
      }}
    >
      Go to the shop
    </Button>
    <ReactMarkdown
      {...{
        className: 'markdown',
        linkTarget: '_blank',
        source: `
### How to play:

The goal of Farmhand is to make money by buying, growing, harvesting, and then selling crops. Keep an eye on prices though, because they go up and down every day! The best farmers buy seeds for a low price and sell them for a high price.

If you can master the art of the harvest, there's no limit to how profitable you can become! Every farmer starts with a $${STANDARD_LOAN_AMOUNT} loan from the bank. If you run out of money, you can always take out another loan. Be careful though, because the bank takes a portion of your sales until the debt is repaid. You can access your bank account in the menu.

A few other tips:

* Press the bed button in the corner of the screen to end the day and advance the game. This also saves your progress.

* Crops need water to grow.

* Purchasing a cow pen will allow you to buy, sell, milk, and breed cows. Can you breed the mythical Rainbow Cow?

* Put up a scarecrow to protect your field!

* Watch your inventory space as you obtain items. You can purchase additional storage space in the shop.

* You'll be able to unlock new crops and items as you level up. Sell crops and milk to gain experience!

* Bank loans accrue interest daily, so pay off your balance as soon as you can.

    `,
      }}
    />
  </div>
)

Home.propTypes = {
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
