import React from 'react'
import { shallow } from 'enzyme'

import { generateCow } from '../../utils/index.js'
import { cowColors } from '../../enums.js'
import { pixel } from '../../img/index.js'
import { noop } from '../../utils/noop.js'

import { Cow } from './CowPen.js'

let component

beforeEach(() => {
  vitest.useFakeTimers()
  vitest.spyOn(global, 'setTimeout')
  vitest.spyOn(global, 'clearTimeout')
})

describe('Cow', () => {
  beforeEach(() => {
    vitest.spyOn(Math, 'random').mockReturnValue(0)
    component = shallow(
      <Cow
        {...{
          allowCustomPeerCowNames: false,
          cow: {
            ...generateCow(),
            color: cowColors.WHITE,
          },
          cowInventory: [],
          handleCowPenUnmount: noop,
          handleCowClick: noop,
          id: '',
          isSelected: false,
        }}
      />
    )
  })

  test('has correct image', () => {
    expect(component.find('img').props().src).toEqual(pixel)
  })

  describe('movement', () => {
    test('schedules a position change at boot', () => {
      expect(global.setTimeout).toHaveBeenCalledWith(
        component.instance().repositionTimeoutHandler,
        0
      )
    })

    describe('cow is selected', () => {
      test('reposition is not scheduled', () => {
        global.setTimeout.mockClear()
        component.setProps({ isSelected: true })
        component.instance().scheduleMove()

        expect(global.setTimeout).not.toHaveBeenCalledWith(
          component.instance().repositionTimeoutHandler,
          0
        )
      })
    })

    describe('receiving different isSelected prop', () => {
      describe('while cow is moving', () => {
        beforeEach(() => {
          vitest.clearAllTimers()
        })

        describe('isSelected false -> true', () => {
          test('cancels sheduled position change', () => {
            component.setProps({ isSelected: false })
            component.instance().scheduleMove()
            component.setProps({ isSelected: true })
            expect(global.clearTimeout).toHaveBeenCalled()
          })
        })

        describe('isSelected true -> false', () => {
          test('no-ops', () => {
            component.setProps({ isSelected: true })
            component.instance().scheduleMove()
            global.clearTimeout.mockClear()
            component.setProps({ isSelected: false })
            expect(global.clearTimeout).not.toHaveBeenCalled()
          })
        })
      })

      describe('isSelected true -> false', () => {
        test('schedules a position change', () => {
          component.setProps({ isSelected: true })
          const scheduleMove = vitest.spyOn(
            component.instance(),
            'scheduleMove'
          )
          component.setProps({ isSelected: false })
          expect(scheduleMove).toHaveBeenCalled()
        })
      })
    })

    describe('move', () => {
      test('updates state', () => {
        component.instance().move()
        expect(component.state().isTransitioning).toEqual(true)
      })
    })
  })

  describe('hug animation', () => {
    describe('cow.happinessBoostsToday is increased', () => {
      let cow

      beforeEach(() => {
        cow = generateCow()
        component.setProps({
          cow,
        })
      })

      test('updates showHugAnimation state', () => {
        expect(component.state().showHugAnimation).toBe(false)

        component.setProps({
          cow: { ...cow, happinessBoostsToday: 1 },
        })

        expect(component.state().showHugAnimation).toBe(true)
      })

      test('showHugAnimation state is reset after animation is scheduled to complete', () => {
        component.setProps({
          cow: { ...cow, happinessBoostsToday: 1 },
        })

        vitest.runOnlyPendingTimers()
        expect(component.state().showHugAnimation).toBe(false)
      })
    })
  })
})
