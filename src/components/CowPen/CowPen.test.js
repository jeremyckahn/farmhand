import React from 'react'
import { shallow } from 'enzyme'

import { generateCow } from '../../utils'
import { cowColors } from '../../enums'
import { animals } from '../../img'

import { Cow, CowPen } from './CowPen'

let component

beforeEach(() => {
  jest.useFakeTimers()
})

describe('CowPen', () => {
  beforeEach(() => {
    component = shallow(
      <CowPen
        {...{
          cowInventory: [],
          handleCowClick: () => {},
          selectedCowId: '',
        }}
      />
    )
  })

  describe('cow selection', () => {
    describe('cow is not selected', () => {
      test('provides correct isSelected prop', () => {
        component.setProps({
          cowInventory: [generateCow({ id: 'foo' })],
          selectedCowId: 'bar',
        })

        expect(component.find(Cow).props().isSelected).toEqual(false)
      })
    })

    describe('cow is selected', () => {
      test('provides correct isSelected prop', () => {
        component.setProps({
          cowInventory: [generateCow({ id: 'foo' })],
          selectedCowId: 'foo',
        })

        expect(component.find(Cow).props().isSelected).toEqual(true)
      })
    })
  })
})

describe('Cow', () => {
  beforeEach(() => {
    jest.spyOn(Math, 'random').mockReturnValue(0)
    component = shallow(
      <Cow
        {...{
          cow: {
            ...generateCow(),
            color: cowColors.WHITE,
          },
          cowInventory: [],
          handleCowClick: () => {},
          isSelected: false,
        }}
      />
    )
  })

  test('has correct image', () => {
    expect(component.find('img').props().src).toEqual(
      animals.cow[cowColors.WHITE.toLowerCase()]
    )
  })

  describe('movement', () => {
    test('schedules a position change at boot', () => {
      expect(setTimeout).toHaveBeenCalledWith(
        component.instance().repositionTimeoutHandler,
        0
      )
    })

    describe('cow is selected', () => {
      test('reposition is not scheduled', () => {
        setTimeout.mockClear()
        component.setProps({ isSelected: true })
        component.instance().scheduleMove()

        expect(setTimeout).not.toHaveBeenCalledWith(
          component.instance().repositionTimeoutHandler,
          0
        )
      })
    })

    describe('receiving different isSelected prop', () => {
      describe('while cow is moving', () => {
        beforeEach(() => {
          clearTimeout.mockClear()
        })

        describe('isSelected false -> true', () => {
          test('cancels sheduled position change', () => {
            component.setProps({ isSelected: false })
            component.instance().scheduleMove()
            component.setProps({ isSelected: true })
            expect(clearTimeout).toHaveBeenCalled()
          })
        })

        describe('isSelected true -> false', () => {
          test('no-ops', () => {
            component.setProps({ isSelected: true })
            component.instance().scheduleMove()
            clearTimeout.mockClear()
            component.setProps({ isSelected: false })
            expect(clearTimeout).not.toHaveBeenCalled()
          })
        })
      })

      describe('isSelected true -> false', () => {
        test('schedules a position change', () => {
          component.setProps({ isSelected: true })
          const scheduleMove = jest.spyOn(component.instance(), 'scheduleMove')
          component.setProps({ isSelected: false })
          expect(scheduleMove).toHaveBeenCalled()
        })
      })
    })

    describe('move', () => {
      test('updates state', () => {
        component.instance().move()
        expect(component.state().isMoving).toEqual(true)
      })
    })

    describe('finishMoving', () => {
      test('updates state', () => {
        component.setState({ isMoving: true })
        component.instance().finishMoving()
        expect(component.state().isMoving).toEqual(false)
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

        jest.runOnlyPendingTimers()
        expect(component.state().showHugAnimation).toBe(false)
      })
    })
  })
})
