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
      grid[0].length - offsetX[0],
      grid.length - offsetY[0],
      words,
      true
    ),
    vertical: getLines2(
      grid.length - offsetY[0],
      grid[0].length - offsetX[0],
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
  let dragBorderColor = ''
  if (dragStart && dragEnd) {
    const x1 = dragStart.x - state.offsetX[0]
    const y1 = dragStart.y - state.offsetY[0]
    const x2 = dragEnd.x - state.offsetX[0]
    const y2 = dragEnd.y - state.offsetY[0]
    dragBorderColor = isValidWord(
      word(
        Math.min(x1, x2),
        Math.min(y1, y2),
        Math.max(x1, x2),
        Math.max(y1, y2)
      ),
      state.words
    )
      ? 'border-green-400'
      : 'border-red-800'
  }
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
              const wordStartNumber = R.indexOf(
                { x: x - state.offsetX[0], y: y - state.offsetY[0] },
                numbers
              )
              const border =
                'border border-black ' +
                (letter ||
                (y >= state.offsetY[0] &&
                  x >= state.offsetX[0] &&
                  y < state.grid.length - state.offsetY[1] &&
                  x < state.grid[0].length - state.offsetX[1])
                  ? `${
                      lines.horizontal[y - state.offsetY[0]]?.includes(
                        x - state.offsetX[0]
                      )
                        ? 'border-r-4'
                        : 'pr-1'
                    } ${
                      lines.vertical[x - state.offsetX[0]]?.includes(
                        y - state.offsetY[0]
                      )
                        ? 'border-b-4'
                        : 'pb-1'
                    }`
                  : 'border-dashed')
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
                          word(
                            dragStart.x - state.offsetX[0],
                            dragStart.y - state.offsetY[0],
                            dragEnd.x - state.offsetX[0],
                            dragEnd.y - state.offsetY[0]
                          )
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
                            (w) =>
                              x === w.start.x + state.offsetX[0] &&
                              y === w.start.y + state.offsetY[0],
                            vertical
                          )
                            ? 'border-l-4 border-t-4'
                            : ''
                        } ${
                          R.find(
                            (w) =>
                              x === w.start.x + state.offsetX[0] &&
                              x === w.end.x + state.offsetX[0] &&
                              y >= w.start.y + state.offsetY[0] &&
                              y <= w.end.y + state.offsetY[0],
                            vertical
                          )
                            ? 'border-l-4 border-r-4'
                            : ''
                        } ${
                          R.find(
                            (w) =>
                              x === w.end.x + state.offsetX[0] &&
                              y === w.end.y + state.offsetY[0],
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
                            (w) =>
                              x === w.start.x + state.offsetX[0] &&
                              y === w.start.y + state.offsetY[0],
                            horizontal
                          )
                            ? 'border-l-4 border-t-4'
                            : ''
                        } ${
                          R.find(
                            (w) =>
                              y === w.start.y + state.offsetY[0] &&
                              y === w.end.y + state.offsetY[0] &&
                              x >= w.start.x + state.offsetX[0] &&
                              x <= w.end.x + state.offsetX[0],
                            horizontal
                          )
                            ? 'border-t-4 border-b-4'
                            : ''
                        } ${
                          R.find(
                            (w) =>
                              x === w.end.x + state.offsetX[0] &&
                              y === w.end.y + state.offsetY[0],
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
