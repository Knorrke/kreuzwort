import { exampleState } from './fixtures'
import { reducer, change, word, addWord, changeWord, removeWord } from './reducer'
describe('reducer tests', () => {
  describe('change letter', () => {
    test('change action changes letter', () => {
      const changeAction = change('Z', 0, 0)
      const state = reducer(exampleState, changeAction)
      expect(state.grid[0][0]).toEqual('Z')
    })
  })

  describe('word tests', () => {
    test('word action adds word to list', () => {
      const w = word(0, 1, 0, 1)
      const wordAction = addWord(w)
      const state = reducer(exampleState, wordAction)
      expect(state.words).toContainEqual(w)
    })

    test('change word start and end', () => {
      let state = exampleState
      const oldWord = word(2,1,3,1)
      const newWord = word(1,1,3,1)
      expect(state.words).not.toContainEqual(newWord)
      expect(state.words).toContainEqual(oldWord)
      const changeWordAction = changeWord(oldWord, newWord)
      state = reducer(state, changeWordAction)
      expect(state.words).toContainEqual(newWord)
      expect(state.words).not.toContainEqual(oldWord)
    })

    test('removing word', () => {
      let state = exampleState
      const oldWord = word(2,1,3,1)
      expect(state.words).toContainEqual(oldWord)
      const removeAction = removeWord(oldWord)
      state = reducer(state, removeAction)
      expect(state.words).not.toContainEqual(oldWord)
    })
  })
})