import {
  dialogView,
  fertilizerType,
  fieldMode,
  stageFocusType,
  toolLevel,
  toolType,
} from '../enums.js'

export const testShoveledPlot = (
  plotProps: Partial<farmhand.shoveledPlot>
) => ({
  isShoveled: true,
  daysUntilClear: 5,
  ...plotProps,
})
