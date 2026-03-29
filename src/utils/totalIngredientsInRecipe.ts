export function totalIngredientsInRecipe(recipe, amount = 1) {
  return (
    amount *
// @ts-expect-error
    Object.values(recipe.ingredients).reduce(
// @ts-expect-error
      (acc, quantity) => acc + quantity,
      0
    )
  )
}
