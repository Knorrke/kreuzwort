import { exampleState } from './fixtures'
import { getLines, getNumbers } from './Grid'
import { reducer, State, word } from './reducer'

describe('lines test', () => {
  describe('horizontal', () => {
    it('resolves lineendings with multiple words in one line', () => {
      const grid: State = reducer({
        grid: [['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']],
        words: [word(0, 0, 2, 0), word(4, 0, 6, 0), word(7, 0, 9, 0)]
      })
      const lines = getLines(grid)
      expect(lines.horizontal).toEqual([[2, 3, 6]])
    })
    it('resolves lineendings with one word per line', () => {
      const grid = exampleState

      const lines = getLines(grid)
      expect(lines.horizontal).toEqual([[0], [0,1], []])
    })
  })
  describe('vertical', () => {
    it('resolves lineendings with multiple words in one line', () => {
      const grid: State = reducer({
        grid: [
          ['A'],
          ['B'],
          ['C'],
          ['D'],
          ['E'],
          ['F'],
          ['G'],
          ['H'],
          ['I'],
          ['J'],
        ],
        words: [word(0, 0, 0, 2), word(0, 4, 0, 6), word(0, 7, 0, 9)]
      })
      const lines = getLines(grid)
      expect(lines.vertical).toEqual([[2, 3, 6]])
    })
    it('resolves lineendings with one word per line', () => {
      const grid = exampleState
      
      const lines = getLines(grid)
      expect(lines.vertical).toEqual([[0,1], [1], [], [0]])
    })
  })
})

describe('numbers test', () => {
  it('preduces correct numbers', () => {
    const grid = exampleState

    const numbers = getNumbers(grid)
    expect(numbers).toEqual([
      { x: 1, y: 0 },
      { x: 2, y: 0 },
      { x: 2, y: 1 },
      { x: 3, y: 1 },
      { x: 0, y: 2 },
    ])
  })
})
