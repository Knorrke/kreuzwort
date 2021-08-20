import * as R from "ramda";
import { workerData } from "worker_threads";

interface Word {
  word: string;
  x: number;
  y: number;
}

type Line = { x: number } | { y: number };

export interface GridProps {
  width: number;
  height: number;
  horizontal: Word[];
  vertical: Word[];
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
  // sort
  const sorted: Word[] = R.sortWith(
    [R.ascend(R.prop(rowProp)), R.ascend(R.prop(colProp))],
    words
  );
  R.forEach((word: Word) => {
    const col = word[colProp];
    const width = word[rowProp];
    if (width > height) return;
    if (col < 0) {
      lines[width] = R.remove(0, word.word.length - 1 + col, lines[width]);
    } else {
      lines[width] = R.remove(
        R.indexOf(col, lines[width]),
        word.word.length - 1,
        lines[width]
      );
    }
  }, sorted);
  return lines;
}

export function getLines({ width, height, horizontal, vertical }: GridProps) {
  return {
    horizontal: getLines2(width, height, horizontal, true),
    vertical: getLines2(height, width, vertical, false),
  };
}

export function Grid(props: GridProps) {
  const lines = getLines(props);
  return <>hello</>;
}
