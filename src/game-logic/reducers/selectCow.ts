export const selectCow = (
  state: farmhand.state,
  { id }: { id: string }
): farmhand.state => ({
  ...state,
  selectedCowId: id,
})
