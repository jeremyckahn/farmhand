export default function totalIngredientsInRecipe(recipe, amount = 1) {
  return (
    amount *
    Object.values(recipe.ingredients).reduce(
      (acc, quantity) => acc + quantity,
      0
    )
  )
}
