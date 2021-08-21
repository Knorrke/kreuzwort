import { exampleState } from './fixtures'
import { reducer, change, word, addWord } from './reducer'
describe('reducer tests', () => {
  describe('change letter', () => {
    test('change action changes letter', () => {
      const changeAction = change('Z', 0, 0)
      const state = reducer(exampleState, changeAction)
      expect(state.grid[0][0]).toEqual('Z')
    })
  })

  describe('add word', () => {
    test('word action adds word to list', () => {
      const w = word(0, 1, 0, 1)
      const wordAction = addWord(w)
      const state = reducer(exampleState, wordAction)
      expect(state.words).toContain(w)
    })
  })
})