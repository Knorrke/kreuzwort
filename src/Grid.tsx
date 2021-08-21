import isHotkey from 'is-hotkey'
import * as R from 'ramda'
import React from 'react'
import {
  State,
  Pos,
  Word,
  change,
  isLetter,
  addWord,
  word,
  isValidWord,
  undo,
  redo,
} from './reducer'
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
  const [dragImg] = React.useState(() => {
    const dragImg = new Image(0, 0)
    dragImg.src =
      'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
    return dragImg
  })
  const { state, dispatch } = React.useContext(StateContext)
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

  function focusInput(x: number, y: number) {
    document.getElementById(`letter-${x}-${y}`)?.focus()
  }
  return (
    <>
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
              const vertical = R.filter(
                (w) => w.start.x === w.end.x,
                state.words
              )
              const horizontal = R.filter(
                (w) => w.start.y === w.end.y,
                state.words
              )
              const wordStartNumber = R.indexOf({ x, y }, numbers)
              const border = letter
                ? `border-black border ${
                    lines.horizontal[y]?.includes(x) && state.grid[y][x + 1]
                      ? 'border-r-4'
                      : 'pr-1'
                  } ${
                    lines.vertical[x]?.includes(y) && state.grid[y + 1][x]
                      ? 'border-b-4'
                      : 'pb-1'
                  }`
                : props.showSolution
                ? 'border-black border border-dashed'
                : 'border-none'
              return (
                <div
                  draggable
                  className="relative flex w-10 h-10 items-center justify-center"
                  key={x}
                  onDragStart={(e) => {
                    e.dataTransfer.setDragImage(dragImg, 0, 0)
                    setDragStart({ x, y })
                  }}
                  onDragEnter={() => {
                    setDragEnd({ x, y })
                  }}
                  onDragEnd={() => {
                    if (dragStart && dragEnd) {
                      dispatch(
                        addWord(
                          word(dragStart.x, dragStart.y, dragEnd.x, dragEnd.y)
                        )
                      )
                      setDragStart(undefined)
                      setDragEnd(undefined)
                    }
                  }}
                >
                  <div
                    className={`${border} w-10 h-10 flex items-center justify-center`}
                  >
                    {props.highlightVertical && (
                      <div
                        className={`absolute border-red-400 w-8 h-10 pointer-events-none ${
                          R.find(
                            (w) => x === w.start.x && y === w.start.y,
                            vertical
                          )
                            ? 'border-l-4 border-t-4'
                            : ''
                        } ${
                          R.find(
                            (w) =>
                              x === w.start.x &&
                              x === w.end.x &&
                              y >= w.start.y &&
                              y <= w.end.y,
                            vertical
                          )
                            ? 'border-l-4 border-r-4'
                            : ''
                        } ${
                          R.find(
                            (w) => x === w.end.x && y === w.end.y,
                            vertical
                          )
                            ? 'border-r-4 border-b-4'
                            : ''
                        }`}
                      />
                    )}
                    {props.highlightHorizontal && (
                      <div
                        className={`absolute border-blue-400 w-10 h-8 pointer-events-none ${
                          R.find(
                            (w) => x === w.start.x && y === w.start.y,
                            horizontal
                          )
                            ? 'border-l-4 border-t-4'
                            : ''
                        } ${
                          R.find(
                            (w) =>
                              y === w.start.y &&
                              y === w.end.y &&
                              x >= w.start.x &&
                              x <= w.end.x,
                            horizontal
                          )
                            ? 'border-t-4 border-b-4'
                            : ''
                        } ${
                          R.find(
                            (w) => x === w.end.x && y === w.end.y,
                            horizontal
                          )
                            ? 'border-r-4 border-b-4'
                            : ''
                        }`}
                      />
                    )}
                    {dragStart && (
                      <div
                        className={`absolute ${dragBorderColor} w-7 h-7 pointer-events-none ${
                          x === dragStart?.x && y === dragStart?.y
                            ? 'border-l-4 border-t-4'
                            : ''
                        } ${
                          y === dragStart?.y &&
                          y === dragEnd?.y &&
                          x >= dragStart?.x &&
                          x <= dragEnd?.x //horizontal
                            ? 'border-t-4 border-b-4'
                            : x === dragStart?.x &&
                              x === dragEnd?.x &&
                              y >= dragStart?.y &&
                              y <= dragEnd?.y //vertical
                            ? 'border-l-4 border-r-4'
                            : ''
                        } ${
                          x === dragEnd?.x && y === dragEnd?.y
                            ? 'border-r-4 border-b-4'
                            : ''
                        }`}
                      />
                    )}
                    {wordStartNumber >= 0 ? (
                      <span className="absolute top-0 left-1 text-xs">
                        {wordStartNumber + 1}
                      </span>
                    ) : null}
                    {props.showSolution && (
                      <input
                        id={`letter-${x}-${y}`}
                        className="text-center w-10 h-10 bg-transparent border-none outline-none"
                        type="text"
                        size={1}
                        value={letter}
                        pattern="[A-Z]"
                        onChange={(e) => {
                          if (!e.target.value) {
                            dispatch(change('', x, y))
                          } else {
                            const letter = e.target.value
                              .substr(-1)
                              .toUpperCase()
                            if (isLetter(letter)) {
                              dispatch(change(letter, x, y))
                            }
                          }
                        }}
                        onClick={(e) => (e.target as HTMLInputElement).select()}
                        // onFocus={(e) => (e.target as HTMLInputElement).select()}
                        onKeyDown={(e) => {
                          if (isHotkey('left')(e.nativeEvent)) {
                            focusInput(x - 1, y)
                            e.preventDefault()
                          } else if (isHotkey('right')(e.nativeEvent)) {
                            focusInput(x + 1, y)
                            e.preventDefault()
                          } else if (
                            isHotkey('up')(e.nativeEvent) ||
                            isHotkey('shift+enter')(e.nativeEvent)
                          ) {
                            focusInput(x, y - 1)
                            e.preventDefault()
                          } else if (
                            isHotkey('down')(e.nativeEvent) ||
                            isHotkey('enter')(e.nativeEvent)
                          ) {
                            focusInput(x, y + 1)
                            e.preventDefault()
                          } else if (isHotkey('mod+z')(e.nativeEvent)) {
                            dispatch(undo())
                          } else if (
                            isHotkey('mod+shift+z')(e.nativeEvent) ||
                            isHotkey('mod+y')(e.nativeEvent)
                          ) {
                            dispatch(redo())
                          }
                        }}
                        tabIndex={0}
                      />
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )
      })}
    </>
  )
}
