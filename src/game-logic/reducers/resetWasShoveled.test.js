import { resetWasShoveled } from './resetWasShoveled'

describe('resetWasShoveled', () => {
  test('it decrements daysUntilClear if value is above 1', () => {
    const plotContents = resetWasShoveled({
      isShoveled: true,
      daysUntilClear: 2,
    })

    expect(plotContents).toEqual({ isShoveled: true, daysUntilClear: 1 })
  })

  test('it resets the plotContents when daysUntilClear is 1', () => {
    const plotContents = resetWasShoveled({
      isShoveled: true,
      daysUntilClear: 1,
    })

    expect(plotContents).toEqual(null)
  })

  test('will return the plot contents if it is anything else', () => {
    const plotContents = resetWasShoveled('sprinkler')

    expect(plotContents).toEqual('sprinkler')
  })
})
