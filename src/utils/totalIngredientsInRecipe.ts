export function totalIngredientsInRecipe(
  recipe: farmhand.recipe,
  amount = 1
): number {
  return (
    amount *
    Object.values(recipe.ingredients as Record<string, number>).reduce(
      (acc: number, quantity: number) => acc + quantity,
      0
    )
  )
}
