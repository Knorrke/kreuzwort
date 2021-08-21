import React from 'react'
import * as R from 'ramda'
import { State, Action, word } from './reducer'

export const initialState: State = {
  grid: R.times(() => R.times<''>(() => '', 15), 10),
  words: [],
  offsetX: 0,
  offsetY: 0,
}

export const StateContext = React.createContext<{
  state: State
  dispatch: (action?: Action) => void
}>({
  state: initialState,
  dispatch: () => {},
})
