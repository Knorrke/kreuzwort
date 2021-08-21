import * as R from 'ramda'

// prettier-ignore
export type Letter = 'A'|'B'|'C'|'D'|'E'|'F'|'G'|'H'|'I'|'J'|'K'|'L'|'M'|'N'|'O'|'P'|'Q'|'R'|'S'|'T'|'U'|'V'|'W'|'X'|'Y'|'Z'
export function isLetter(letter: Letter | string): letter is Letter {
  return /[A-Z]/.test(letter)
}
export interface Pos {
  x: number
  y: number
}
export interface Word {
  start: Pos
  end: Pos
}

export interface State {
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

interface ChangeAction {
  type: 'ChangeAction'
  payload: {
    letter: Letter
    x: number
    y: number
  }
}
export type Action = ChangeAction

export function reducer(previous: State, action?: Action): State {
  if (!action) return previous
  switch (action.type) {
    case 'ChangeAction':
      return {
        ...previous,
        grid: R.update(
          action.payload.y,
          R.update(
            action.payload.x,
            action.payload.letter,
            previous.grid[action.payload.y]
          ),
          previous.grid
        ),
      }
  }
}

export function change(letter: Letter, x: number, y: number): ChangeAction {
  return {
    type: 'ChangeAction',
    payload: {
      letter: letter,
      x: x,
      y: y,
    },
  }
}
