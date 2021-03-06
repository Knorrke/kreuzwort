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
}

function isBaseState(state: State | BaseState): state is BaseState {
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
export function isValidWord(word: Word, words: Word[]) {
  // check that it is longer than one character
  if (R.equals(word.start, word.end)) return false
  // check that it is in one line
  if (word.start.x !== word.end.x && word.start.y !== word.end.y) return false

  const filterSameLine = R.filter((other) => {
    return word.start.x === word.end.x // word is vertical
      ? other.start.x === other.end.x && other.start.x === word.start.x // filter only vertical in same col
      : other.start.y === other.end.y && other.start.y === word.start.y // filter only horizontal in same row
  }, words)
  return (
    // check if word start is intersecting existing word
    R.none((w) => {
      if (word.start.x === word.end.x) {
        return (
          (word.start.y >= w.start.y && word.start.y <= w.end.y) ||
          (w.start.y >= word.start.y && w.start.y <= word.end.y)
        )
      } else {
        return (
          (word.start.x >= w.start.x && word.start.x <= w.end.x) ||
          (w.start.x >= word.start.x && w.start.x <= word.end.x)
        )
      }
    }, filterSameLine)
  )
}

interface ChangeAction {
  type: 'ChangeAction'
  payload: {
    letter: Letter | ''
    x: number
    y: number
  }
}

interface AddWordAction {
  type: 'AddWordAction'
  payload: {
    word: Word
  }
}
interface ChangeWordAction {
  type: 'ChangeWordAction'
  payload: {
    old: Word
    new: Word
  }
}
interface RemoveWordAction {
  type: 'RemoveWordAction'
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

interface ResetAction {
  type: 'ResetAction'
  payload: {
    baseState?: BaseState
  }
}

interface InitializeAction {
  type: 'InitializeAction'
}

export type Action =
  | ChangeAction
  | AddWordAction
  | ChangeWordAction
  | RemoveWordAction
  | UndoAction
  | RedoAction
  | ResetAction
  | InitializeAction

export function reducer(
  prev: State | BaseState,
  action: Action = {
    type: 'InitializeAction',
  }
): State {
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
    case 'AddWordAction':
      return isValidWord(action.payload.word, previous.words)
        ? {
            ...previous,
            words: [...previous.words, action.payload.word],
            history: {
              ...previous.history,
              actions: [...previous.history.actions, action],
              undoStack: [],
            },
          }
        : previous
    case 'ChangeWordAction':
      return {
        ...previous,
        words: R.map(
          (w) => (R.equals(w, action.payload.old) ? action.payload.new : w),
          previous.words
        ),
        history: {
          ...previous.history,
          actions: [...previous.history.actions, action],
          undoStack: [],
        },
      }
    case 'RemoveWordAction':
      return {
        ...previous,
        words: R.without([action.payload.word], previous.words),
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
          undoStack: [
            ...previous.history.undoStack,
            previous.history.actions[previous.history.actions.length - 1],
          ],
        },
      }
    }
    case 'RedoAction': {
      const nextState = reducer(
        previous,
        previous.history.undoStack[previous.history.undoStack.length - 1]
      )
      return {
        ...nextState,
        history: {
          ...nextState.history,
          undoStack: R.slice(0, -1, previous.history.undoStack),
        },
      }
    }
    case 'ResetAction':
      return {
        ...reducer(action.payload.baseState || previous.history.initialState),
      }
    case 'InitializeAction':
      return previous
  }
}

export function change(
  letter: Letter | '',
  x: number,
  y: number
): ChangeAction {
  return {
    type: 'ChangeAction',
    payload: {
      letter: letter,
      x: x,
      y: y,
    },
  }
}

export function addWord(word: Word): AddWordAction {
  return {
    type: 'AddWordAction',
    payload: {
      word: word,
    },
  }
}

export function changeWord(oldWord: Word, newWord: Word): ChangeWordAction {
  return {
    type: 'ChangeWordAction',
    payload: {
      old: oldWord,
      new: newWord,
    },
  }
}

export function removeWord(word: Word): RemoveWordAction {
  return {
    type: 'RemoveWordAction',
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

export function reset(initial?: BaseState): ResetAction {
  return {
    type: 'ResetAction',
    payload: {
      baseState: initial,
    },
  }
}
