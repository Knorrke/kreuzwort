import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faUndo,
  faRedo,
  faTrash,
  faDownload,
} from '@fortawesome/free-solid-svg-icons'
import download from 'downloadjs'
import { toPng } from 'html-to-image'
import React from 'react'
import { GlobalHotKeys } from 'react-hotkeys'
import { AutoSave, loadSavedState } from './AutoSave'
import { Grid } from './Grid'
import { Action, redo, reducer, reset, State, undo } from './reducer'
import { initialState, StateContext } from './StateContext'
import { Definitions } from './Definitions'

function Button(
  props: React.PropsWithChildren<{
    bg: string
    'hover-bg': string
    onClick: () => void
    title?: string
  }>
) {
  const { bg, 'hover-bg': hoverBg, children, ...params } = props
  return (
    <button
      className={`${bg} ${hoverBg} text-white font-bold py-2 px-4 rounded`}
      {...params}
    >
      {children}
    </button>
  )
}
function App() {
  const [state, dispatch] = React.useReducer<React.Reducer<State, Action>>(
    reducer,
    loadSavedState() || initialState
  )
  const solutionRef = React.createRef<HTMLDivElement>()
  const gridRef = React.createRef<HTMLDivElement>()
  const [highlightHorizontal, setHighlightHorizontal] = React.useState(true)
  const [highlightVertical, setHighlightVertical] = React.useState(true)
  return (
    <div className="mx-auto sm:w-3/4 md:w-2/4 my-10 inset-0 flex items-center justify-center">
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
              <Button
                bg="bg-blue-500"
                hover-bg="hover:bg-blue-700"
                onClick={() => dispatch(undo())}
                title="Rückgängig (Strg+Z)"
              >
                <FontAwesomeIcon icon={faUndo} />
              </Button>
              <Button
                bg="bg-blue-500"
                hover-bg="hover:bg-blue-700"
                onClick={() => dispatch(redo())}
                title="Wiederholen (Strg+Y)"
              >
                <FontAwesomeIcon icon={faRedo} />
              </Button>
              <Button
                bg="bg-red-500"
                hover-bg="hover:bg-red-700"
                onClick={() => {
                  if (window.confirm('Alles löschen?')) {
                    dispatch(reset(initialState))
                  }
                }}
              >
                <FontAwesomeIcon icon={faTrash} className="mr-2" />
                Zurücksetzen
              </Button>
              <Button
                bg="bg-blue-500"
                hover-bg="hover:bg-blue-700"
                onClick={() => {
                  if (solutionRef.current) {
                    toPng(solutionRef.current, {
                      quality: 1,
                      pixelRatio: 1,
                      cacheBust: true,
                    })
                      .then(function (dataUrl) {
                        download(dataUrl, 'solution.png')
                      })
                      .catch(function (error) {
                        console.error('oops, something went wrong!', error)
                      })
                  }
                }}
                title="Download"
              >
                <FontAwesomeIcon icon={faDownload} />
              </Button>
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
            <div ref={solutionRef}>
              <Grid
                showSolution
                highlightHorizontal={highlightHorizontal}
                highlightVertical={highlightVertical}
              />
            </div>
            <hr className="border border-gray-400 my-4 w-full" />
            <div className="my-8">
              <span className="text-2xl mr-3">Vorschau: </span>
              <Button
                bg="bg-blue-500"
                hover-bg="hover:bg-blue-700"
                onClick={() => {
                  if (gridRef.current) {
                    toPng(gridRef.current)
                      .then(function (dataUrl) {
                        download(dataUrl, 'grid.png')
                      })
                      .catch(function (error) {
                        console.error('oops, something went wrong!', error)
                      })
                  }
                }}
                title="Download"
              >
                <FontAwesomeIcon icon={faDownload} className="mr-2" />
                Rätsel herunterladen
              </Button>
            </div>
            <div className="flex flex-row space-x-12">
              <div ref={gridRef}>
                <Grid />
              </div>
              <Definitions />
            </div>
          </GlobalHotKeys>
        </StateContext.Provider>
      </div>
    </div>
  )
}

export default App
