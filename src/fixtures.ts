import { word, withHistory } from './reducer'

export const exampleState = withHistory({
  grid: [
    ['', 'A', 'N', 'D'],
    ['', 'M', 'O', 'K'],
    ['B', 'O', 'W', 'L'],
  ],
  words: [
    word(0, 0, 2, 0),
    word(1, 1, 2, 1),
    word(-1, 2, 3, 2),
    word(0, 0, 0, 1),
    word(1, 0, 1, 2),
    word(2, 1, 2, 2),
  ],
  offsetX: [1, 0],
  offsetY: [0, 0],
})
