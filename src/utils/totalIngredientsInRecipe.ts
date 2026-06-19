export function totalIngredientsInRecipe(recipe: any, amount = 1) {
  return (
    amount *
    Object.values(recipe.ingredients as Record<string, number>).reduce(
      (acc: number, quantity: number) => acc + quantity,
      0
    )
  )
}
