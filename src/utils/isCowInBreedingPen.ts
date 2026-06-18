export const isCowInBreedingPen = (
  cow: farmhand.cow,
  cowBreedingPen: farmhand.cowBreedingPen
): boolean =>
  cowBreedingPen.cowId1 === cow.id || cowBreedingPen.cowId2 === cow.id
