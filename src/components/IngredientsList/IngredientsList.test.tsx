import React from 'react'
import { render, screen } from '@testing-library/react'

import IngredientsList from './IngredientsList.js'

describe('<IngredientsList />', () => {
  let ingredientsString = ''

  beforeAll(() => {
    const props = {
      playerInventoryQuantities: { carrot: 101, onion: 0 },
      recipe: {
        ingredients: { carrot: 4, onion: 8 },
        name: 'carrot soup',
      },
    }

    render(<IngredientsList {...props} />)
    const ingredients = screen.getAllByTestId('ingredient')
    ingredientsString = ingredients[0].textContent || ''
  })

  test('it renders all ingredients', () => {
    expect(screen.getAllByTestId('ingredient').length).toEqual(2)
  })

  test('it renders the recipe ingredients', () => {
    expect(ingredientsString.includes('4 x Carrot')).toEqual(true)
  })

  test('it renders the ingredients available', () => {
    expect(ingredientsString.includes('On hand: 101')).toEqual(true)
  })
})
