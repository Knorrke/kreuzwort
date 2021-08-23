import isHotkey from 'is-hotkey'
import React from 'react'
import { change, isLetter, Letter, redo, undo } from './reducer'
import { StateContext } from './StateContext'

function focusInput(x: number, y: number) {
  document.getElementById(`letter-${x}-${y}`)?.focus()
}

export function LetterInput(props: { x: number; y: number; letter: Letter|'' }) {
  const { x, y, letter } = props
  const { dispatch } = React.useContext(StateContext)
  return (
    <input
      id={`letter-${x}-${y}`}
      className="text-center w-10 h-10 bg-transparent border-none outline-none"
      type="text"
      size={1}
      value={letter}
      pattern="[A-Z]"
      onChange={(e) => {
        if (!e.target.value) {
          dispatch(change('', x, y))
        } else {
          const letter = e.target.value.substr(-1).toUpperCase()
          if (isLetter(letter)) {
            dispatch(change(letter, x, y))
          }
        }
      }}
      onClick={(e) => (e.target as HTMLInputElement).select()}
      // onFocus={(e) => (e.target as HTMLInputElement).select()}
      onKeyDown={(e) => {
        if (isHotkey('left')(e.nativeEvent)) {
          focusInput(x - 1, y)
          e.preventDefault()
        } else if (isHotkey('right')(e.nativeEvent)) {
          focusInput(x + 1, y)
          e.preventDefault()
        } else if (
          isHotkey('up')(e.nativeEvent) ||
          isHotkey('shift+enter')(e.nativeEvent)
        ) {
          focusInput(x, y - 1)
          e.preventDefault()
        } else if (
          isHotkey('down')(e.nativeEvent) ||
          isHotkey('enter')(e.nativeEvent)
        ) {
          focusInput(x, y + 1)
          e.preventDefault()
        } else if (isHotkey('mod+z')(e.nativeEvent)) {
          dispatch(undo())
        } else if (
          isHotkey('mod+shift+z')(e.nativeEvent) ||
          isHotkey('mod+y')(e.nativeEvent)
        ) {
          dispatch(redo())
        }
      }}
      tabIndex={0}
    />
  )
}
