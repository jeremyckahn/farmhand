import React from 'react'
import { shallow } from 'enzyme'

import { getPlotContentFromItemId } from '../../utils'
import { testCrop, testShoveledPlot } from '../../test-utils'
import { pixel, plotStates } from '../../img'
import { cropLifeStage, fertilizerType } from '../../enums'
import { FERTILIZER_BONUS } from '../../constants'

import { Plot, getBackgroundStyles, getDaysLeftToMature } from './Plot'

jest.mock('../../data/maps')
jest.mock('../../data/items')
jest.mock('../../data/levels', () => ({ levels: [] }))
jest.mock('../../data/shop-inventory')
jest.mock('../../img')

let component

beforeEach(() => {
  component = shallow(
    <Plot
      {...{
        handlePlotClick: () => {},
        isInHoverRange: false,
        lifeStage: cropLifeStage.SEED,
        selectedItemId: '',
        setHoveredPlot: () => {},
        x: 0,
        y: 0,
      }}
    />
  )
})

test('defaults to rending a pixel', () => {
  expect(component.find('img').props().src).toBe(pixel)
})

test('renders empty class', () => {
  expect(component.find('.Plot').hasClass('is-empty')).toBeTruthy()
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

test('renders "is-ripe" class', () => {
  component.setProps({ lifeStage: cropLifeStage.GROWN })
  expect(component.find('.Plot').hasClass('is-ripe')).toBeTruthy()
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

describe('can-be-mined class', () => {
  test('renders class', () => {
    component.setProps({
      plotContent: null,
    })

    expect(component.find('.Plot').hasClass('can-be-mined')).toBeTruthy()
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
    expect(component.find('.Plot').props().style.backgroundImage).toBe(null)
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

  describe('class states', () => {
    describe('crops', () => {
      test('renders fertilized crop classes', () => {
        component.setProps({
          plotContent: testCrop({
            itemId: 'sample-crop-1',
            fertilizerType: fertilizerType.STANDARD,
          }),
          lifeStage: cropLifeStage.GROWN,
        })

        const classList = component
          .find('img')
          .props()
          .className.split(' ')

        expect(classList).toContain('animated')
        expect(classList).toContain('heartBeat')
      })
    })

    describe('ores', () => {
      test('renders newly-mined ore classes', () => {
        component.setProps({
          plotContent: testShoveledPlot({
            oreId: 'sample-ore',
            isShoveled: false
          }),
        })

        let classList = component
          .find('img')
          .props()
          .className.split(' ')

        expect(classList).not.toContain('animated')
        expect(classList).not.toContain('was-just-shoveled')

        component.setProps({
          plotContent: testShoveledPlot({
            oreId: 'sample-ore',
            isShoveled: true
          }),
        })

        // FIXME: Get this to work
        // classList = component
          // .find('img')
          // .props()
          // .className.split(' ')

        // expect(classList).toContain('animated')
        // expect(classList).toContain('was-just-shoveled')
      })
    })
  })
})

describe('getBackgroundStyles', () => {
  test('returns null for !plotContent', () => {
    expect(getBackgroundStyles()).toBe(null)
  })

  test('constructs style for fertilizerType === fertilizerType.STANDARD', () => {
    expect(
      getBackgroundStyles(testCrop({ fertilizerType: fertilizerType.STANDARD }))
    ).toBe(`url(${plotStates['fertilized-plot']})`)
  })

  test('constructs style for fertilizerType === fertilizerType.RAINBOW', () => {
    expect(
      getBackgroundStyles(testCrop({ fertilizerType: fertilizerType.RAINBOW }))
    ).toBe(`url(${plotStates['rianbow-fertilized-plot']})`)
  })

  test('constructs style for wasWateredToday', () => {
    expect(getBackgroundStyles(testCrop({ wasWateredToday: true }))).toBe(
      `url(${plotStates['watered-plot']})`
    )
  })

  test('constructs style for fertilizerType === fertilizerType.STANDARD and wasWateredToday', () => {
    expect(
      getBackgroundStyles(
        testCrop({
          fertilizerType: fertilizerType.STANDARD,
          wasWateredToday: true,
        })
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

    describe('plot contains non-crop content', () => {
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
