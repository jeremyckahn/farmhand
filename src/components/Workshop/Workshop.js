import React from 'react'
import { object } from 'prop-types'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Divider from '@material-ui/core/Divider'
import ReactMarkdown from 'react-markdown'

import { recipesMap } from '../../data/maps'
import Recipe from '../Recipe'

import FarmhandContext from '../../Farmhand.context'

import './Workshop.sass'

const Workshop = ({ learnedRecipes }) => (
  <div className="Workshop">
    <h3>Learned Recipes</h3>
    <section>
      <ul className="card-list">
        {Object.keys(learnedRecipes).map(recipeId => (
          <li key={recipeId}>
            <Recipe
              {...{
                recipe: recipesMap[recipeId],
              }}
            />
          </li>
        ))}
      </ul>
    </section>
    <Divider />
    <section>
      <Card>
        <CardContent>
          <ReactMarkdown
            {...{
              linkTarget: '_blank',
              className: 'markdown',
              source: `Recipes are learned by selling crops and animal products. Sell as much as you can of a wide variety of items!`,
            }}
          />
        </CardContent>
      </Card>
    </section>
  </div>
)

Workshop.propTypes = {
  learnedRecipes: object.isRequired,
}

export default function Consumer(props) {
  return (
    <FarmhandContext.Consumer>
      {({ gameState, handlers }) => (
        <Workshop {...{ ...gameState, ...handlers, ...props }} />
      )}
    </FarmhandContext.Consumer>
  )
}
