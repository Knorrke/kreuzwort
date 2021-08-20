import React from "react";
import * as R from "ramda";
import { workerData } from "worker_threads";

interface Pos {
  x: number;
  y: number;
}
interface Word {
  start: Pos;
  end: Pos;
}
// prettier-ignore
type Letter = 'A'|'B'|'C'|'D'|'E'|'F'|'G'|'H'|'I'|'J'|'K'|'L'|'M'|'N'|'O'|'P'|'Q'|'R'|'S'|'T'|'U'|'V'|'W'|'X'|'Y'|'Z'

export interface GridProps {
  grid: (Letter | "")[][];
  words: Word[];
  offsetX: number;
  offsetY: number;
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
  };
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
  const colProp = horizontal ? "x" : "y";
  const rowProp = horizontal ? "y" : "x";
  const lines: number[][] = R.times(
    () => R.times(R.identity, width - 1),
    height
  );
  const filtered: Word[] = R.filter(
    (word) =>
      horizontal ? word.start.y == word.end.y : word.start.x == word.end.x,
    words
  );
  R.forEach((word: Word) => {
    const col = word.start[colProp];
    const row = word.start[rowProp];
    if (row > height) return;
    const start = col < 0 ? 0 : R.indexOf(col, lines[row]);
    const length = col < 0 ? word.end[colProp] : word.end[colProp] - col;
    lines[row] = R.remove(start, length, lines[row]);
  }, filtered);
  return lines;
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
  };
}

export function getNumbers({ grid, words, offsetX, offsetY }: GridProps) {
  
}

export function Grid(props: GridProps) {
  const lines = getLines(props);
  return (
    <>
      {props.grid.map((row, i) => {
        return (
          <div className="flex flex-row text-lg" key={i}>
            {row.map((letter, j) => {
              if (!letter) return (
                <div className='flex w-12 h-12' />
              )
              return (
                <div
                  className={`flex w-12 h-12 items-center justify-center border border-black ${
                    i >= props.offsetY &&
                    j >= props.offsetX &&
                    lines.horizontal[i - props.offsetY]?.includes(j - props.offsetX) ?
                    'border-r-4' : ''
                  } ${
                    i >= props.offsetY &&
                    j >= props.offsetX &&
                    lines.vertical[j - props.offsetX]?.includes(i - props.offsetY) ?
                    'border-b-4' : ''
                  }`}
                  key={j}
                >
                  {letter}
                </div>
              );
            })}
          </div>
        );
      })}
    </>
  );
}
