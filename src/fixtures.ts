import { word, reducer } from './reducer'

export const exampleState = reducer({
  grid: [
    ['', 'A', 'N', 'D'],
    ['', 'M', 'O', 'K'],
    ['B', 'O', 'W', 'L'],
  ],
  words: [
    word(1, 0, 3, 0),
    word(2, 1, 3, 1),
    word(0, 2, 3, 2),
    word(1, 0, 1, 1),
    word(2, 0, 2, 2),
    word(3, 1, 3, 2),
  ]
})
