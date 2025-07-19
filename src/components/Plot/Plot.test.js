import React from 'react'
import { shallow } from 'enzyme'

import { getPlotContentFromItemId } from '../../utils/index.js'
import { noop } from '../../utils/noop.js'
import { testCrop } from '../../test-utils/index.js'
import { pixel, plotStates } from '../../img/index.js'
import { cropLifeStage, fertilizerType } from '../../enums.js'
import { FERTILIZER_BONUS } from '../../constants.js'

import { Plot, getBackgroundStyles, getDaysLeftToMature } from './Plot.js'

vitest.mock('../../data/maps.js')
vitest.mock('../../data/items.js')
vitest.mock('../../data/levels.js', () => ({ levels: [] }))
vitest.mock('../../data/shop-inventory.js')
vitest.mock('../../img/index.js')

let component

beforeEach(() => {
  component = shallow(
    <Plot
      {...{
        handlePlotClick: noop,
        isInHoverRange: false,
        lifeStage: cropLifeStage.SEED,
        selectedItemId: '',
        setHoveredPlot: noop,
        x: 0,
        y: 0,
      }}
    />
  )
})

test('defaults to rending a pixel', () => {
  expect(component.find('img').props().src).toBe(pixel)
})

test('renders crop class', () => {
  component.setProps({ plotContent: testCrop({ itemId: 'sample-crop-1' }) })
  expect(component.find('.Plot').hasClass('crop')).toBeTruthy()
})

test('renders is-replantable class', () => {
  component.setProps({
    plotContent: getPlotContentFromItemId('replantable-item'),
  })
  expect(component.find('.Plot').hasClass('is-replantable')).toBeTruthy()
})

test('renders "can-be-harvested" class', () => {
  component.setProps({ lifeStage: cropLifeStage.GROWN })
  expect(component.find('.Plot').hasClass('can-be-harvested')).toBeTruthy()
})

describe('"can-be-fertilized" class', () => {
  describe('plot is empty', () => {
    test('renders class', () => {
      component.setProps({
        plotContent: null,
      })

      expect(component.find('.Plot').hasClass('can-be-fertilized')).toBeFalsy()
    })
  })

  describe('plot contains unfertilized crop', () => {
    describe('crop is fertilized', () => {
      test('renders class', () => {
        component.setProps({
          plotContent: testCrop({
            itemId: 'sample-crop-1',
            fertilizerType: fertilizerType.NONE,
          }),
        })

        expect(
          component.find('.Plot').hasClass('can-be-fertilized')
        ).toBeTruthy()
      })
    })
  })

  describe('plot contains fertilized crop', () => {
    describe('crop is fertilized', () => {
      test('does not render class', () => {
        component.setProps({
          plotContent: testCrop({
            itemId: 'sample-crop-1',
            fertilizerType: fertilizerType.STANDARD,
          }),
        })

        expect(
          component.find('.Plot').hasClass('can-be-fertilized')
        ).toBeFalsy()
      })
    })
  })

  describe('plot contains scarecrow', () => {
    beforeEach(() => {
      component.setProps({
        plotContent: {
          ...getPlotContentFromItemId('scarecrow'),
        },
      })
    })

    describe('selectedItemId === fertilizer', () => {
      beforeEach(() => {
        component.setProps({
          selectedItemId: 'fertilizer',
        })
      })

      test('does not render class', () => {
        expect(
          component.find('.Plot').hasClass('can-be-fertilized')
        ).toBeFalsy()
      })
    })

    describe('selectedItemId === rainbow-fertilizer', () => {
      beforeEach(() => {
        component.setProps({
          selectedItemId: 'rainbow-fertilizer',
        })
      })

      describe('plot is not rainbow-fertilized', () => {
        test('renders class', () => {
          expect(
            component.find('.Plot').hasClass('can-be-fertilized')
          ).toBeTruthy()
        })
      })

      describe('plot is rainbow-fertilized', () => {
        test('does not render class', () => {
          component.setProps({
            plotContent: {
              ...getPlotContentFromItemId('scarecrow'),
              fertilizerType: fertilizerType.RAINBOW,
            },
          })

          expect(
            component.find('.Plot').hasClass('can-be-fertilized')
          ).toBeFalsy()
        })
      })
    })
  })
})

test('renders provided image data', () => {
  const image = 'data:image/png;base64,some-other-image'

  component.setProps({
    image,
    plotContent: testCrop({ itemId: 'sample-crop-1' }),
  })

  expect(component.find('img').props().style.backgroundImage).toBe(
    `url(${image})`
  )
})

describe('background image', () => {
  test('renders pixel', () => {
    expect(component.find('.Plot').props().style.backgroundImage).toBe(
      undefined
    )
  })

  test('renders wateredPlot image', () => {
    component.setProps({
      plotContent: testCrop({
        itemId: 'sample-crop-1',
        wasWateredToday: true,
      }),
    })

    expect(component.find('.Plot').props().style.backgroundImage).toBe(
      `url(${plotStates['watered-plot']})`
    )
  })
})

describe('getBackgroundStyles', () => {
  test('returns null for !plotContent', () => {
    expect(getBackgroundStyles(null)).toBe(undefined)
  })

  test('constructs style for fertilizerType === fertilizerType.STANDARD', () => {
    expect(
      getBackgroundStyles(
        /** @type {globalThis.farmhand.plotContent} */ (testCrop({
          fertilizerType: fertilizerType.STANDARD,
        }))
      )
    ).toBe(`url(${plotStates['fertilized-plot']})`)
  })

  test('constructs style for fertilizerType === fertilizerType.RAINBOW', () => {
    expect(
      getBackgroundStyles(
        /** @type {globalThis.farmhand.plotContent} */ (testCrop({
          fertilizerType: fertilizerType.RAINBOW,
        }))
      )
    ).toBe(`url(${plotStates['rianbow-fertilized-plot']})`)
  })

  test('constructs style for wasWateredToday', () => {
    expect(
      getBackgroundStyles(
        /** @type {globalThis.farmhand.plotContent} */ (testCrop({
          wasWateredToday: true,
        }))
      )
    ).toBe(`url(${plotStates['watered-plot']})`)
  })

  test('constructs style for fertilizerType === fertilizerType.STANDARD and wasWateredToday', () => {
    expect(
      getBackgroundStyles(
        /** @type {globalThis.farmhand.plotContent} */ (testCrop({
          fertilizerType: fertilizerType.STANDARD,
          wasWateredToday: true,
        }))
      )
    ).toBe(
      `url(${plotStates['fertilized-plot']}), url(${plotStates['watered-plot']})`
    )
  })
})

describe('getDaysLeftToMature', () => {
  describe('plot does not contain a crop', () => {
    describe('plot is empty', () => {
      test('returns null', () => {
        expect(getDaysLeftToMature(null)).toEqual(null)
      })
    })

    test('plot contains non-crop content', () => {
      expect(
        getDaysLeftToMature(getPlotContentFromItemId('replantable-item'))
      ).toEqual(null)
    })
  })

  describe('crop is newly planted', () => {
    test('computes full lifecycle duration', () => {
      expect(
        getDaysLeftToMature({
          itemId: 'sample-crop-3',
          daysWatered: 0,
          fertilizerType: fertilizerType.NONE,
        })
      ).toEqual(10)
    })
  })

  describe('crop is fertilized', () => {
    describe('crop is newly planted', () => {
      test('computes projected lifecycle duration', () => {
        expect(
          getDaysLeftToMature({
            itemId: 'sample-crop-3',
            daysWatered: 0,
            fertilizerType: fertilizerType.STANDARD,
          })
        ).toEqual(7)
      })
    })

    describe('crop has less than a full day to mature', () => {
      test('projection is corrected up to 1 day', () => {
        expect(
          getDaysLeftToMature({
            itemId: 'sample-crop-3',
            daysWatered: 9.9,
            fertilizerType: fertilizerType.STANDARD,
          })
        ).toEqual(1)
      })
    })

    test('handles day rounding correctly', () => {
      expect(
        getDaysLeftToMature({
          itemId: 'sample-crop-3',
          daysWatered: 5.6,
          fertilizerType: fertilizerType.STANDARD,
        })
      ).toEqual(3)

      expect(
        getDaysLeftToMature({
          itemId: 'sample-crop-3',
          daysWatered: 5.6 + 1 + FERTILIZER_BONUS,
          fertilizerType: fertilizerType.STANDARD,
        })
      ).toEqual(2)
    })
  })
})
