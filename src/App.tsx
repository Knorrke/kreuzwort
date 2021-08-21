import React from 'react'
import { GlobalHotKeys } from 'react-hotkeys'
import './App.css'
import { Grid } from './Grid'
import { Action, redo, reducer, State, undo } from './reducer'
import { initialState, StateContext } from './StateContext'

function App() {
  const [state, dispatch] = React.useReducer<React.Reducer<State, Action>>(reducer, initialState)
  const [highlightHorizontal, setHighlightHorizontal] = React.useState(false)
  const [highlightVertical, setHighlightVertical] = React.useState(false)
  return (
    <div className="mx-auto sm:w-3/4 md:w-2/4 fixed inset-0 flex items-center justify-center">
      <div className="flex flex-col items-center justify-center">
        <StateContext.Provider value={{ state: state, dispatch: dispatch }}>
          <GlobalHotKeys
            keyMap={{
              UNDO: ['ctrl+z', 'command+z'],
              REDO: ['ctrl+y', 'command+y', 'ctrl+shift+z', 'command+shift+z'],
            }}
            handlers={{
              UNDO: () => { console.log('undo'); dispatch(undo()) },
              REDO: () => { console.log('redo'); dispatch(redo()) },
            }}
          >
            <Grid
              showSolution
              highlightHorizontal={highlightHorizontal}
              highlightVertical={highlightVertical}
            />
            {/* <div className="m-4" />
          <Grid /> */}
            <div className="flex flex-col flex-align-left">
              <div className="flex space-x-2">
                <input
                  className="form-checkbox"
                  name="highlightHorizontal"
                  type="checkbox"
                  value={highlightHorizontal ? 'checked' : ''}
                  onChange={(e) => setHighlightHorizontal(!highlightHorizontal)}
                />
                <label htmlFor="highlightHorizontal">
                  Horizontale Wörter hervorheben
                </label>
              </div>
              <div className="flex space-x-2">
                <input
                  className="form-checkbox"
                  type="checkbox"
                  value={highlightVertical ? 'checked' : ''}
                  onChange={(e) => setHighlightVertical(!highlightVertical)}
                />
                <label htmlFor="highlightHorizontal">
                  Vertikale Wörter hervorheben
                </label>
              </div>
            </div>
          </GlobalHotKeys>
        </StateContext.Provider>
      </div>
    </div>
  )
}

export default App
