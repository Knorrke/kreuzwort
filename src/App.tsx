import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUndo, faRedo, faTrash } from '@fortawesome/free-solid-svg-icons'
import React from 'react'
import { GlobalHotKeys } from 'react-hotkeys'
import { AutoSave, loadSavedState } from './AutoSave'
import { Grid } from './Grid'
import { Action, redo, reducer, reset, State, undo } from './reducer'
import { initialState, StateContext } from './StateContext'
import { Definitions } from './Definitions'

function App() {
  const [state, dispatch] = React.useReducer<React.Reducer<State, Action>>(
    reducer,
    loadSavedState() || initialState
  )
  const [highlightHorizontal, setHighlightHorizontal] = React.useState(true)
  const [highlightVertical, setHighlightVertical] = React.useState(true)
  return (
    <div className="mx-auto sm:w-3/4 md:w-2/4 mt-10 inset-0 flex items-center justify-center">
      <div className="flex flex-col items-center justify-center">
        <StateContext.Provider value={{ state: state, dispatch: dispatch }}>
          <GlobalHotKeys
            keyMap={{
              UNDO: ['ctrl+z', 'command+z'],
              REDO: ['ctrl+y', 'command+y', 'ctrl+shift+z', 'command+shift+z'],
            }}
            handlers={{
              UNDO: () => dispatch(undo()),
              REDO: () => dispatch(redo()),
            }}
          >
            <AutoSave />
            <div className="right flex flex-row space-x-4 mb-4">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => dispatch(undo())}
                title="Rückgängig (Strg + Z)"
              >
                <FontAwesomeIcon icon={faUndo} />
              </button>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => dispatch(redo())}
                title="Wiederholen (Strg + Y)"
              >
                <FontAwesomeIcon icon={faRedo} />
              </button>
              <button
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => {
                  if (window.confirm('Alles löschen?')) {
                    dispatch(reset(initialState))
                  }
                }}
              >
                <FontAwesomeIcon icon={faTrash} className="mr-2" />
                Zurücksetzen
              </button>
            </div>
            <div className="flex flex-row flex-align-left mb-4">
              <div className="flex space-x-2 mr-6">
                <input
                  id="highlightHorizontal"
                  className="form-checkbox"
                  type="checkbox"
                  checked={highlightHorizontal}
                  onChange={() => setHighlightHorizontal(!highlightHorizontal)}
                />
                <label htmlFor="highlightHorizontal">
                  Horizontale Wörter hervorheben
                </label>
              </div>
              <div className="flex space-x-2">
                <input
                  id="highlightVertical"
                  className="form-checkbox"
                  type="checkbox"
                  checked={highlightVertical}
                  onChange={() => setHighlightVertical(!highlightVertical)}
                />
                <label htmlFor="highlightVertical">
                  Vertikale Wörter hervorheben
                </label>
              </div>
            </div>
            <Grid
              showSolution
              highlightHorizontal={highlightHorizontal}
              highlightVertical={highlightVertical}
            />
            <h2 className="text-2xl my-8">Vorschau:</h2>
            <div className="flex flex-row space-x-12">
              <Definitions/>
              <Grid />
            </div>
          </GlobalHotKeys>
        </StateContext.Provider>
      </div>
    </div>
  )
}

export default App
