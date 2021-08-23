import * as R from 'ramda'
import React from 'react'
import { getNumbers } from './Grid'
import { StateContext } from './StateContext'

export function Definitions() {
  const { state } = React.useContext(StateContext)
  const numbers = getNumbers(state)
  const filteredHorizontal = R.filter(
    (word) => word.start.y === word.end.y,
    state.words
  )
  const horizontalWithNumbers = R.map(
    (word) => ({ wordBounds: word, number: 1+R.indexOf(word.start, numbers) }),
    filteredHorizontal
  )
  const horizontalWithNumbersSorted = R.sortWith([R.ascend(R.prop('number'))], horizontalWithNumbers)
  const filteredVertical = R.filter(
    (word) => word.start.x === word.end.x,
    state.words
  )
  const verticalWithNumbers = R.map(
    (word) => ({ wordBounds: word, number: 1+R.indexOf(word.start, numbers) }),
    filteredVertical
  )
  const verticalWithNumbersSorted = R.sortWith([R.ascend(R.prop('number'))], verticalWithNumbers)

  return (
    <div className="flex flex-col shadow-md p-4 border rounded">
      <h3 className="text-xl font-bold">Waagerecht:</h3>
      {horizontalWithNumbersSorted.map(({ wordBounds, number }) => {
        let word = ''
        for (let i = 0; i <= wordBounds.end.x - wordBounds.start.x; i++) {
          word += state.grid[wordBounds.start.y][wordBounds.start.x + i] || ' _'
        }
        return (
          <div key={number}>
            <span className="ml-3 mr-2">{number}</span>
            <span>{word}</span>
          </div>
        )
      })}
      <h3 className="mt-2 text-xl font-bold">Senkrecht:</h3>
      {verticalWithNumbersSorted.map(({ wordBounds, number }) => {
        let word = ''
        for (let i = 0; i <= wordBounds.end.y - wordBounds.start.y; i++) {
          word += state.grid[wordBounds.start.y + i][wordBounds.start.x]
        }
        return (
          <div key={number}>
            <span className="ml-3 mr-2">{number}</span>
            <span>{word}</span>
          </div>
        )
      })}
    </div>
  )
}
