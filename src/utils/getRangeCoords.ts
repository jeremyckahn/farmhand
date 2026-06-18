export const getRangeCoords = (
  rangeSize: number,
  centerX: number,
  centerY: number
) => {
  const squareSize = 2 * rangeSize + 1
  const rangeStartX = centerX - rangeSize
  const rangeStartY = centerY - rangeSize

  return new Array(squareSize).fill(null).map((_, yIndex) =>
    new Array(squareSize).fill(null).map((__, xIndex) => ({
      x: rangeStartX + xIndex,
      y: rangeStartY + yIndex,
    }))
  )
}
