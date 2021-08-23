import classNames from 'classnames'
import * as R from 'ramda'
import React from 'react'
import { MarkWordDragZone as AddWordDragZone } from './AddWordDragZone'
import { Highlights } from './Highlight'
import { LetterInput } from './LetterInput'
import { State, Pos, Word, word, isValidWord } from './reducer'
import { StateContext } from './StateContext'

export interface GridProps {
  showSolution?: boolean
  highlightHorizontal?: boolean
  highlightVertical?: boolean
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
      horizontal ? word.start.y === word.end.y : word.start.x === word.end.x,
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

export function getLines({ grid, words }: State) {
  return {
    horizontal: getLines2(grid[0].length, grid.length, words, true),
    vertical: getLines2(grid.length, grid[0].length, words, false),
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
  const { state } = React.useContext(StateContext)
  const lines = getLines(state)
  const numbers = getNumbers(state)
  const [dragStart, setDragStart] = React.useState<Pos>()
  const [dragEnd, setDragEnd] = React.useState<Pos>()
  const dragBorderColor =
    dragStart && dragEnd
      ? isValidWord(
          word(
            Math.min(dragStart.x, dragEnd.x),
            Math.min(dragStart.y, dragEnd.y),
            Math.max(dragStart.x, dragEnd.x),
            Math.max(dragStart.y, dragEnd.y)
          ),
          state.words
        )
        ? 'border-green-400'
        : 'border-red-800'
      : ''
  const vertical = R.filter((w) => w.start.x === w.end.x, state.words)
  const horizontal = R.filter((w) => w.start.y === w.end.y, state.words)

  return (
    <div className="flex flex-col items-center justify-center">
      {state.grid.map((row, y) => {
        return (
          <div
            className="flex flex-row text-lg"
            key={y}
            onDragOver={(e) => {
              e.stopPropagation()
              e.preventDefault()
            }}
          >
            {row.map((letter, x) => {
              const wordStartNumber = R.indexOf({ x, y }, numbers)
              return (
                <AddWordDragZone
                  key={x}
                  x={x}
                  y={y}
                  dragStart={dragStart}
                  setDragStart={setDragStart}
                  dragEnd={dragEnd}
                  setDragEnd={setDragEnd}
                >
                  <div
                    className={classNames(
                      'w-10 h-10 flex items-center justify-center border-black',
                      {
                        border: letter || props.showSolution,
                        'border-dashed': !letter && props.showSolution,
                        'border-none': !letter && !props.showSolution,
                      },
                      letter &&
                        lines.horizontal[y].includes(x) &&
                        state.grid[y][x + 1]
                        ? 'border-r-4'
                        : 'pr-1',
                      letter &&
                        lines.vertical[x].includes(y) &&
                        state.grid[y + 1][x]
                        ? 'border-b-4'
                        : 'pb-1'
                    )}
                  >
                    <Highlights
                      highlightHorizontal={props.highlightHorizontal}
                      highlightVertical={props.highlightVertical}
                      x={x}
                      y={y}
                      dragColor={dragBorderColor}
                      dragStart={dragStart}
                      dragEnd={dragEnd}
                      horizontalWords={horizontal}
                      verticalWords={vertical}
                    />
                    {wordStartNumber >= 0 ? (
                      <span className="absolute top-0 left-1 text-xs">
                        {wordStartNumber + 1}
                      </span>
                    ) : null}
                    {props.showSolution && (
                      <LetterInput x={x} y={y} letter={letter} />
                    )}
                  </div>
                </AddWordDragZone>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}
