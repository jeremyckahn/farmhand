import React, { useState } from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { cropLifeStage, fertilizerType } from '../../enums.js'
import { testCrop, testShoveledPlot } from '../../test-utils/index.js'
import {
  getCropFromItemId,
  getPlotContentFromItemId,
} from '../../utils/index.js'
import { noop } from '../../utils/noop.js'
import { items, pixel, plotStates } from '../../img/index.js'
import { FERTILIZER_BONUS } from '../../constants.js'

import { Plot, getBackgroundStyles, getDaysLeftToMature } from './Plot.js'

vitest.mock('../../data/maps.js')
vitest.mock('../../data/items.js')
vitest.mock('../../data/levels.js', () => ({ levels: [] }))
vitest.mock('../../data/shop-inventory.js')
vitest.mock('../../img/index.js')

describe('Plot component', () => {
  const defaultProps = {
    handlePlotClick: noop,
    isInHoverRange: false,
    lifeStage: cropLifeStage.SEED,
    selectedItemId: '',
    setHoveredPlot: noop,
    x: 0,
    y: 0,
  }

  describe('empty plot', () => {
    test('defaults to rendering a pixel', () => {
      render(<Plot {...defaultProps} />)
      const img = screen.getByAltText('Empty plot')
      expect(img).toHaveAttribute('src', pixel)
    })

    test('renders standard classes', () => {
      render(<Plot {...defaultProps} />)
      const img = screen.getByAltText('Empty plot')
      const plotElement = img.closest('.Plot')
      const { classList } = plotElement || { classList: new DOMTokenList() }

      expect(classList).toContain('is-empty')
    })
  })

  describe('crop rendering', () => {
    test('renders crop class', () => {
      render(
        <Plot
          {...defaultProps}
          plotContent={testCrop({ itemId: 'sample-crop-1' })}
        />
      )
      const img = screen.getByRole('img')
      const plotElement = img.closest('.Plot')
      expect(plotElement).toHaveClass('crop')
    })

    test('renders is-replantable class', () => {
      render(
        <Plot
          {...defaultProps}
          plotContent={getPlotContentFromItemId('replantable-item')}
        />
      )
      const img = screen.getByRole('img')
      const plotElement = img.closest('.Plot')
      expect(plotElement).toHaveClass('is-replantable')
    })

    test('renders "can-be-harvested" class', () => {
      render(
        <Plot
          {...defaultProps}
          lifeStage={cropLifeStage.GROWN}
          plotContent={testCrop({ itemId: 'sample-crop-1' })}
        />
      )
      const img = screen.getByRole('img')
      const plotElement = img.closest('.Plot')
      expect(plotElement).toHaveClass('can-be-harvested')
    })

    test('renders crop classes with animation', () => {
      render(
        <Plot
          {...defaultProps}
          lifeStage={cropLifeStage.GROWN}
          plotContent={testCrop({ itemId: 'carrot' })}
        />
      )
      const img = screen.getByAltText('Carrot Seed')
      expect(img).toHaveClass('animated')
      expect(img).toHaveClass('heartBeat')
    })
  })

  describe('"can-be-fertilized" class', () => {
    describe('plot is empty', () => {
      test('does not render class', () => {
        render(<Plot {...defaultProps} plotContent={null} />)
        const img = screen.getByRole('img')
        const plotElement = img.closest('.Plot')
        expect(plotElement).not.toHaveClass('can-be-fertilized')
      })
    })

    describe('plot contains unfertilized crop', () => {
      test('renders class', () => {
        render(
          <Plot
            {...defaultProps}
            plotContent={testCrop({
              itemId: 'sample-crop-1',
              fertilizerType: fertilizerType.NONE,
            })}
          />
        )
        const img = screen.getByRole('img')
        const plotElement = img.closest('.Plot')
        expect(plotElement).toHaveClass('can-be-fertilized')
      })
    })

    describe('plot contains fertilized crop', () => {
      test('does not render class', () => {
        render(
          <Plot
            {...defaultProps}
            plotContent={testCrop({
              itemId: 'sample-crop-1',
              fertilizerType: fertilizerType.STANDARD,
            })}
          />
        )
        const img = screen.getByRole('img')
        const plotElement = img.closest('.Plot')
        expect(plotElement).not.toHaveClass('can-be-fertilized')
      })
    })

    describe('plot contains scarecrow', () => {
      const scarecrowProps = {
        ...defaultProps,
        plotContent: {
          ...getPlotContentFromItemId('scarecrow'),
        },
      }

      describe('selectedItemId === fertilizer', () => {
        test('does not render class', () => {
          render(<Plot {...scarecrowProps} selectedItemId="fertilizer" />)
          const img = screen.getByRole('img')
          const plotElement = img.closest('.Plot')
          expect(plotElement).not.toHaveClass('can-be-fertilized')
        })
      })

      describe('selectedItemId === rainbow-fertilizer', () => {
        describe('plot is not rainbow-fertilized', () => {
          test('renders class', () => {
            render(
              <Plot {...scarecrowProps} selectedItemId="rainbow-fertilizer" />
            )
            const img = screen.getByRole('img')
            const plotElement = img.closest('.Plot')
            expect(plotElement).toHaveClass('can-be-fertilized')
          })
        })

        describe('plot is rainbow-fertilized', () => {
          test('does not render class', () => {
            render(
              <Plot
                {...defaultProps}
                selectedItemId="rainbow-fertilizer"
                plotContent={{
                  ...getPlotContentFromItemId('scarecrow'),
                  fertilizerType: fertilizerType.RAINBOW,
                }}
              />
            )
            const img = screen.getByRole('img')
            const plotElement = img.closest('.Plot')
            expect(plotElement).not.toHaveClass('can-be-fertilized')
          })
        })
      })
    })
  })

  describe('plot label', () => {
    test('renders label for seed', () => {
      render(
        <Plot {...defaultProps} plotContent={getCropFromItemId('carrot')} />
      )
      const plantedCrop = screen.getByAltText('Carrot Seed')
      expect(plantedCrop).toBeInTheDocument()
    })

    test('renders label for seed of crop with varieties', () => {
      render(
        <Plot
          {...defaultProps}
          plotContent={getCropFromItemId('grape-chardonnay')}
        />
      )
      const plantedCrop = screen.getByAltText('Grape Seed')
      expect(plantedCrop).toBeInTheDocument()
    })

    test('renders label for crop', () => {
      render(
        <Plot
          {...defaultProps}
          plotContent={{
            ...getCropFromItemId('carrot'),
            daysOld: 9,
            daysWatered: 9,
          }}
        />
      )
      const plantedCrop = screen.getByAltText('Carrot')
      expect(plantedCrop).toBeInTheDocument()
    })
  })

  describe('image rendering', () => {
    test('renders provided image data', () => {
      const image = 'data:image/png;base64,some-other-image'
      render(
        <Plot
          {...defaultProps}
          image={image}
          plotContent={testCrop({ itemId: 'sample-crop-1' })}
        />
      )
      const img = screen.getByRole('img')
      expect(img.style.backgroundImage).toBe(`url(${image})`)
    })
  })

  describe('background image', () => {
    describe('empty plot', () => {
      test('renders no background image', () => {
        render(<Plot {...defaultProps} />)
        const img = screen.getByRole('img')
        const plotElement = img.closest('.Plot')
        expect(plotElement).toHaveStyle('background-image: ""')
      })
    })

    describe('watered plot', () => {
      test('renders wateredPlot image', () => {
        render(
          <Plot
            {...defaultProps}
            plotContent={testCrop({
              itemId: 'sample-crop-1',
              wasWateredToday: true,
            })}
          />
        )
        const img = screen.getByRole('img')
        const plotElement = img.closest('.Plot')
        expect(plotElement).toHaveStyle(
          `background-image: url(${plotStates['watered-plot']})`
        )
      })
    })

    describe('ores', () => {
      test('renders bare plot classes and newly-mined ore classes', async () => {
        const PlotTestHarness = ({ plotProps }) => {
          const [isShoveled, setIsShoveled] = useState(false)

          return (
            <div>
              <Plot
                {...{
                  ...plotProps,
                  plotContent: testShoveledPlot({
                    oreId: 'stone',
                    isShoveled,
                    daysUntilClear: 5,
                  }),
                  handlePlotClick: () => setIsShoveled(true),
                }}
              />
            </div>
          )
        }

        render(
          <PlotTestHarness
            plotProps={{
              isInHoverRange: false,
              selectedItemId: '',
              setHoveredPlot: noop,
              x: 0,
              y: 0,
            }}
          />
        )

        const img = screen.getByAltText('Empty plot')
        expect(img).not.toHaveClass('animated')
        expect(img).not.toHaveClass('was-just-shoveled')

        await userEvent.click(img)

        // Verify that the classes are applied correctly after clicking
        await waitFor(() => {
          const updatedImg = screen.getByAltText('Empty plot')
          expect(updatedImg).toHaveClass('animated')
          expect(updatedImg).toHaveClass('was-just-shoveled')
        })
      })
    })

    describe('scarecrows', () => {
      test('renders scarecrow image', async () => {
        render(
          <Plot
            {...defaultProps}
            plotContent={{
              ...getPlotContentFromItemId('scarecrow'),
            }}
          />
        )
        const img = await screen.findByAltText('Scarecrow')
        expect(img.style.backgroundImage).toMatch(items.scarecrow)
      })
    })

    describe('sprinklers', () => {
      test('renders sprinkler image', async () => {
        render(
          <Plot
            {...defaultProps}
            plotContent={{
              ...getPlotContentFromItemId('sprinkler'),
            }}
          />
        )
        const img = await screen.findByAltText('Sprinkler')
        expect(img.style.backgroundImage).toMatch(items.sprinkler)
      })
    })
  })
})

describe('getBackgroundStyles', () => {
  test('returns undefined for !plotContent', () => {
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
