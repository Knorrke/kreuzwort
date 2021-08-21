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

export interface State extends BaseState {
  history: { initialState: BaseState; actions: Action[]; undoStack: Action[] }
}

export interface BaseState {
  grid: (Letter | '')[][]
  words: Word[]
  offsetX: [number, number]
  offsetY: [number, number]
}

function isBaseState(state: State|BaseState) : state is BaseState {
  return (state as State).history === undefined
}

export function word(x1: number, y1: number, x2: number, y2: number): Word {
  return {
    start: { x: Math.min(x1, x2), y: Math.min(y1, y2) },
    end: { x: Math.max(x1, x2), y: Math.max(y1, y2) },
  }
}

export function withHistory(baseState: BaseState): State {
  return {
    ...baseState,
    history: {
      initialState: baseState,
      actions: [],
      undoStack: [],
    },
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

interface WordAction {
  type: 'WordAction'
  payload: {
    word: Word
  }
}

interface UndoAction {
  type: 'UndoAction'
}

interface RedoAction {
  type: 'RedoAction'
}

interface InitializeAction {
  type: 'InitializeAction'
}

export type Action = ChangeAction | WordAction | UndoAction | RedoAction | InitializeAction


export function reducer(prev: State|BaseState, action: Action = {
  type: 'InitializeAction'
}): State {
  const previous = isBaseState(prev) ? withHistory(prev) : prev
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
        history: {
          ...previous.history,
          actions: [...previous.history.actions, action],
          undoStack: [],
        },
      }
    case 'WordAction':
      return {
        ...previous,
        words: [...previous.words, action.payload.word],
        history: {
          ...previous.history,
          actions: [...previous.history.actions, action],
          undoStack: [],
        },
      }
    case 'UndoAction': {
      const nextState = R.reduce(
        reducer,
        reducer(previous.history.initialState),
        R.slice(0, -1, previous.history.actions)
      )
      return {
        ...nextState,
        history: {
          ...nextState.history,
          undoStack: [...previous.history.undoStack, previous.history.actions[previous.history.actions.length -1]]
        }
      }
    }
    case 'RedoAction': {
      const nextState = reducer(previous, previous.history.undoStack[previous.history.undoStack.length - 1])
      console.log('redone', nextState, previous.history)
      return {
        ...nextState,
        history: {
          ...nextState.history,
          undoStack: R.slice(0, -1, previous.history.undoStack),
        },
      }
    }
    default:
      return previous
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

export function addWord(word: Word): WordAction {
  return {
    type: 'WordAction',
    payload: {
      word: word,
    },
  }
}

export function undo(): UndoAction {
  return {
    type: 'UndoAction',
  }
}

export function redo(): RedoAction {
  return {
    type: 'RedoAction',
  }
}
