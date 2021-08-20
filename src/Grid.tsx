import React from 'react'
import * as R from 'ramda'
import { workerData } from 'worker_threads'

interface Pos {
  x: number
  y: number
}
interface Word {
  start: Pos
  end: Pos
}
// prettier-ignore
type Letter = 'A'|'B'|'C'|'D'|'E'|'F'|'G'|'H'|'I'|'J'|'K'|'L'|'M'|'N'|'O'|'P'|'Q'|'R'|'S'|'T'|'U'|'V'|'W'|'X'|'Y'|'Z'

export interface GridProps {
  grid: (Letter | '')[][]
  words: Word[]
  offsetX: number
  offsetY: number
}

export function word(
  startX: number,
  startY: number,
  endX: number,
  endY: number
): Word {
  return {
    start: { x: startX, y: startY },
    end: { x: endX, y: endY },
  }
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

export function getLines({ grid, words, offsetX, offsetY }: GridProps) {
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

export function getNumbers({ words }: GridProps): Pos[] {
  const uniqStarts = R.uniq(R.map((word) => word.start, words))
  const sorted = R.sortWith(
    [R.ascend(R.prop('y')), R.ascend(R.prop('x'))],
    uniqStarts
  )
  return sorted
}

export function Grid(props: GridProps) {
  const lines = getLines(props)
  const numbers = getNumbers(props)
  return (
    <>
      {props.grid.map((row, y) => {
        return (
          <div className="flex flex-row text-lg" key={y}>
            {row.map((letter, x) => {
              if (!letter) return <div className="flex w-12 h-12" key={x} />
              const wordStartNumber = R.indexOf({x: x-props.offsetX, y: y-props.offsetY}, numbers)
              return (
                <div
                  className={`relative flex w-12 h-12 items-center justify-center border border-black ${
                    y >= props.offsetY &&
                    x >= props.offsetX &&
                    lines.horizontal[y - props.offsetY]?.includes(
                      x - props.offsetX
                    )
                      ? 'border-r-4'
                      : ''
                  } ${
                    y >= props.offsetY &&
                    x >= props.offsetX &&
                    lines.vertical[x - props.offsetX]?.includes(
                      y - props.offsetY
                    )
                      ? 'border-b-4'
                      : ''
                  }`}
                  key={x}
                >
                  { wordStartNumber >= 0 ? <span className="absolute top-0 left-1 text-sm">{wordStartNumber+1}</span> : null}
                  {letter}
                </div>
              )
            })}
          </div>
        )
      })}
    </>
  )
}
