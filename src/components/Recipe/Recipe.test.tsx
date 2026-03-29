import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { INFINITE_STORAGE_LIMIT } from '../../constants.js'
import { testItem, testRecipe } from '../../test-utils/index.js'

import { Recipe } from './Recipe.js'

vitest.mock('../../data/maps.js', async importOriginal => {
  const actual = await importOriginal()
  return {
    // @ts-ignore - vitest mock typing issue
    ...actual,
    itemsMap: {
      // @ts-ignore - vitest mock typing issue
      ...actual.itemsMap,
      'sample-recipe-1': {
        id: 'sample-recipe-1',
        name: 'Test Recipe',
        value: 100,
        type: 'CRAFTED_ITEM',
      },
      'sample-item-1': {
        id: 'sample-item-1',
        name: 'Sample Item 1',
        value: 10,
        type: 'CROP',
      },
      'sample-item-2': {
        id: 'sample-item-2',
        name: 'Sample Item 2',
        value: 20,
        type: 'CROP',
      },
      'missing-ingredient': {
        id: 'missing-ingredient',
        name: 'Missing Ingredient',
        value: 5,
        type: 'CROP',
      },
      'test-item': {
        id: 'test-item',
        name: 'Test Item',
        value: 50,
        type: 'CRAFTED_ITEM',
      },
    },
  }
})
vitest.mock('../../data/items.js')
vitest.mock('../../img/index.js', () => ({
  craftedItems: {
    'sample-recipe-1': 'recipe-image.png',
    'test-item': 'test-item-image.png',
  },
  items: {},
}))

const defaultProps = {
  handleMakeRecipeClick: vitest.fn(),
  inventory: [],
  inventoryLimit: INFINITE_STORAGE_LIMIT,
  playerInventoryQuantities: {
    'sample-recipe-1': 0,
    'sample-item-1': 0,
    'sample-item-2': 0,
    'missing-ingredient': 0,
    'test-item': 0,
  },
  recipe: testRecipe({
    ingredients: {
      'sample-item-1': 2,
      'sample-item-2': 1,
    },
  }),
}

test('renders', () => {
  render(<Recipe {...defaultProps} />)
  expect(screen.getByText('Test Recipe')).toBeInTheDocument()
})

test('displays recipe name and description', () => {
  render(<Recipe {...defaultProps} />)

  expect(screen.getByText('Test Recipe')).toBeInTheDocument()
  expect(screen.getByText('A test recipe')).toBeInTheDocument()
})

test('displays sell price information', () => {
  const recipe = testRecipe({
    id: 'test-item',
  })

  render(<Recipe {...defaultProps} recipe={recipe} />)

  expect(screen.getByText(/Sell price:/)).toBeInTheDocument()
})

test('displays current inventory quantity', () => {
  const playerInventoryQuantities = {
    'sample-recipe-1': 5,
  }

  render(
    <Recipe
      {...defaultProps}
      playerInventoryQuantities={playerInventoryQuantities}
    />
  )

  expect(screen.getByText(/In Inventory: 5/)).toBeInTheDocument()
})

test('displays make button', () => {
  render(<Recipe {...defaultProps} />)

  const makeButton = screen.getByRole('button', { name: 'Make' })
  expect(makeButton).toBeInTheDocument()
})

test('displays quantity input', () => {
  render(<Recipe {...defaultProps} />)

  expect(screen.getByDisplayValue('0')).toBeInTheDocument()
})

test('disables make button when recipe cannot be made', () => {
  const recipe = testRecipe({
    ingredients: { 'missing-ingredient': 1 },
  })

  render(<Recipe {...defaultProps} recipe={recipe} />)

  const makeButton = screen.getByRole('button', { name: 'Make' })
  expect(makeButton).toBeDisabled()
})

test('enables make button when recipe can be made', () => {
  const recipe = testRecipe({
    ingredients: { 'sample-item-1': 1 },
  })
  const inventory = [testItem({ id: 'sample-item-1', quantity: 5 })]

  render(<Recipe {...defaultProps} recipe={recipe} inventory={inventory} />)

  const makeButton = screen.getByRole('button', { name: 'Make' })
  expect(makeButton).not.toBeDisabled()
})

test('calls handleMakeRecipeClick when make button is clicked', async () => {
  const user = userEvent.setup()
  const handleMakeRecipeClick = vitest.fn()
  const recipe = testRecipe({
    ingredients: { 'sample-item-1': 1 },
  })
  const inventory = [testItem({ id: 'sample-item-1', quantity: 5 })]

  render(
    <Recipe
      {...defaultProps}
      recipe={recipe}
      inventory={inventory}
      handleMakeRecipeClick={handleMakeRecipeClick}
    />
  )

  const makeButton = screen.getByRole('button', { name: 'Make' })
  await user.click(makeButton)

  expect(handleMakeRecipeClick).toHaveBeenCalledWith(recipe, 1)
})

test('updates quantity when quantity input changes', async () => {
  const user = userEvent.setup()
  const recipe = testRecipe({
    ingredients: { 'sample-item-1': 1 },
  })
  const inventory = [testItem({ id: 'sample-item-1', quantity: 3 })]

  render(<Recipe {...defaultProps} recipe={recipe} inventory={inventory} />)

  const quantityInput = screen.getByDisplayValue('1')
  await user.clear(quantityInput)
  await user.type(quantityInput, '3')

  expect(screen.getByDisplayValue('3')).toBeInTheDocument()
})

test('indicates when recipe can be made', () => {
  const recipe = testRecipe({
    ingredients: { 'sample-item-1': 1 },
  })
  const inventory = [testItem({ id: 'sample-item-1', quantity: 5 })]

  render(<Recipe {...defaultProps} recipe={recipe} inventory={inventory} />)

  const recipeCard = document.querySelector('.Recipe')
  expect(recipeCard).toHaveClass('can-be-made')
})

test('indicates when recipe cannot be made', () => {
  const recipe = testRecipe({
    ingredients: { 'missing-ingredient': 1 },
  })

  render(<Recipe {...defaultProps} recipe={recipe} />)

  const recipeCard = document.querySelector('.Recipe')
  expect(recipeCard).not.toHaveClass('can-be-made')
})

test('renders without description when not provided', () => {
  const recipe = testRecipe({
    description: undefined,
  })

  render(<Recipe {...defaultProps} recipe={recipe} />)

  expect(screen.getByText('Test Recipe')).toBeInTheDocument()
  expect(screen.queryByText('A test recipe')).not.toBeInTheDocument()
})
