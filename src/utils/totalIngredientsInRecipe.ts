export function totalIngredientsInRecipe(
  recipe: { ingredients: Record<string, number> },
  amount = 1
) {
  return (
    amount *
    Object.values(recipe.ingredients).reduce(
      (acc: number, quantity: number) => acc + quantity,
      0
    )
  )
}
