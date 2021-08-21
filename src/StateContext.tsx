import React from 'react'
import * as R from 'ramda'
import { State, Action, BaseState } from './reducer'

const baseState: BaseState = {
  grid: R.times(() => R.times<''>(() => '', 26), 19),
  words: [],
  offsetX: [1, 0],
  offsetY: [2, 1],
}

export const initialState = {
  ...baseState,
  history: {
    initialState: baseState,
    actions: [],
    undoStack: [],
  },
}

export const StateContext = React.createContext<{
  state: State
  dispatch: (action: Action) => void
}>({
  state: initialState,
  dispatch: () => {},
})
