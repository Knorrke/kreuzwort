import { exampleState } from './fixtures'
import { reducer, change } from './reducer'
describe('reducer tests', () => {
  describe('change letter', () => {
    test('change action changes letter', () => {
      const changeAction = change('Z', 0, 0)
      const state = reducer(exampleState, changeAction)
      expect(state.grid[0][0]).toEqual('Z')
    })
  })
})