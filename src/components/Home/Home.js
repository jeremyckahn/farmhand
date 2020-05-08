import React from 'react'
import ReactMarkdown from 'react-markdown'

import FarmhandContext from '../../Farmhand.context'
import LogView from '../LogView'

import './Home.sass'

const Home = () => (
  <div className="Home">
    <ReactMarkdown
      {...{
        linkTarget: '_blank',
        source: `
# Welcome!

You're playing Farmhand, an open source game being developed by [Jeremy Kahn](https://github.com/jeremyckahn). The game is currently smack dab in the middle of development, so it is incomplete and very unpolished. However, you're welcome to try out what's already here!

This is a resource management game that puts a farm in your hand. It is designed to be mobile-friendly and fun for 30 seconds or 30 minutes at a time. Give it a try!

If you'd like to follow this project's development, please check it out on [GitHub](https://github.com/jeremyckahn/farmhand)! 🐮
    `,
      }}
    />
    <LogView />
  </div>
)

Home.propTypes = {}

export default function Consumer(props) {
  return (
    <FarmhandContext.Consumer>
      {({ gameState, handlers }) => (
        <Home {...{ ...gameState, ...handlers, ...props }} />
      )}
    </FarmhandContext.Consumer>
  )
}
