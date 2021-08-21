import * as R from 'ramda'
import React from 'react'
import { State, Pos, Word, change, isLetter } from './reducer'
import { StateContext } from './StateContext'

export interface GridProps {
  showSolution?: boolean
}
/**
 * Searches for horizontal (rowProp === 'x') or vertical lines (rowProp === 'y') lines for the cross word puzzle
 * @param width number of rows
 * @param height number of columns
 * @param words horizontal or vertical words
 * @param rowProp 'x' for horizontal or 'y' for vertical
 * @returns list of indizes for every row
 */
function getLines2(
  width: number,
  height: number,
  words: Word[],
  horizontal: boolean
) {
  const colProp = horizontal ? 'x' : 'y'
  const rowProp = horizontal ? 'y' : 'x'
  const lines: number[][] = R.times(
    () => R.times(R.identity, width - 1),
    height
  )
  const filtered: Word[] = R.filter(
    (word) =>
      horizontal ? word.start.y == word.end.y : word.start.x == word.end.x,
    words
  )
  R.forEach((word: Word) => {
    const col = word.start[colProp]
    const row = word.start[rowProp]
    if (row > height) return
    const start = col < 0 ? 0 : R.indexOf(col, lines[row])
    const length = col < 0 ? word.end[colProp] : word.end[colProp] - col
    lines[row] = R.remove(start, length, lines[row])
  }, filtered)
  return lines
}

export function getLines({ grid, words, offsetX, offsetY }: State) {
  return {
    horizontal: getLines2(
      grid[0].length - offsetX,
      grid.length - offsetY,
      words,
      true
    ),
    vertical: getLines2(
      grid.length - offsetY,
      grid[0].length - offsetX,
      words,
      false
    ),
  }
}

export function getNumbers({ words }: State): Pos[] {
  const uniqStarts = R.uniq(R.map((word) => word.start, words))
  const sorted = R.sortWith(
    [R.ascend(R.prop('y')), R.ascend(R.prop('x'))],
    uniqStarts
  )
  return sorted
}

export function Grid(props: GridProps) {
  const { state, dispatch } = React.useContext(StateContext)
  const lines = getLines(state)
  const numbers = getNumbers(state)
  return (
    <>
      {state.grid.map((row, y) => {
        return (
          <div className="flex flex-row text-lg" key={y}>
            {row.map((letter, x) => {
              const wordStartNumber = R.indexOf({x: x-state.offsetX, y: y-state.offsetY}, numbers)
              const border = 'border border-black ' + (y >= state.offsetY && x >= state.offsetX && letter ? `${
                lines.horizontal[y - state.offsetY]?.includes(
                  x - state.offsetX
                )
                  ? 'border-r-4'
                  : ''
              } ${
                lines.vertical[x - state.offsetX]?.includes(
                  y - state.offsetY
                )
                  ? 'border-b-4'
                  : ''
              }` : 'border-dashed')
              return (
                <div
                  className={`relative flex w-12 h-12 items-center justify-center ${border}`}
                  key={x}
                >
                  { wordStartNumber >= 0 ? <span className="absolute top-0 left-1 text-xs">{wordStartNumber+1}</span> : null}
                  { props.showSolution && (
                    <input className="text-center" type="text" size={1} value={letter} pattern="[A-Z]" onChange={(e) => {
                      const letter = e.target.value.substr(-1).toUpperCase()
                      console.log(letter)
                      if (isLetter(letter)) {
                        console.log(letter)
                        dispatch(change(letter, x,y))
                      }
                    }}
                    onClick={e => (e.target as HTMLInputElement).select()}
                    tabIndex={0}/>
                  )}
                </div>
              )
            })}
          </div>
        )
      })}
    </>
  )
}
