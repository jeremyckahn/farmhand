import { pluralize } from './pluralize.js'

describe('pluralize', () => {
  describe('count is 1', () => {
    test('returns the singular word', () => {
      expect(pluralize('unit', 1)).toEqual('unit')
    })
  })

  describe('count is not 1', () => {
    test('returns the word with an s appended by default', () => {
      expect(pluralize('unit', 0)).toEqual('units')
      expect(pluralize('unit', 2)).toEqual('units')
    })

    describe('a pluralForm is provided', () => {
      test('returns the provided pluralForm', () => {
        expect(pluralize('day', 0, 'days')).toEqual('days')
        expect(pluralize('cherry', 3, 'cherries')).toEqual('cherries')
      })
    })
  })
})
