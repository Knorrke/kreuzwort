import * as R from 'ramda'
import React from 'react'
import {
  addWord,
  changeWord,
  isValidWord,
  Pos,
  removeWord,
  word,
} from './reducer'
import { StateContext } from './StateContext'

interface MarkWordDropZone {
  x: number
  y: number
  dragStart?: Pos
  setDragStart: (newpos: Pos | undefined) => void
  dragEnd?: Pos
  setDragEnd: (newpos: Pos | undefined) => void
}
export function MarkWordDragZone(
  props: React.PropsWithChildren<MarkWordDropZone>
) {
  const [dragImg] = React.useState(() => {
    const dragImg = new Image(0, 0)
    dragImg.src =
      'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
    return dragImg
  })
  const { x, y, dragStart, setDragStart, dragEnd, setDragEnd } = props
  const { state, dispatch } = React.useContext(StateContext)
  return (
    <div
      draggable
      className="relative flex w-10 h-10 items-center justify-center"
      onDragStart={(e) => {
        e.dataTransfer.setDragImage(dragImg, 0, 0)
        setDragStart({ x, y })
      }}
      onDragEnter={() => {
        setDragEnd({ x, y })
      }}
      onDrop={() => {
        if (dragStart && dragEnd) {
          const newWord = word(dragStart.x, dragStart.y, dragEnd.x, dragEnd.y)
          if (isValidWord(newWord, state.words)) {
            dispatch(addWord(newWord))
          } else if (!R.equals(dragStart, dragEnd)) {
            const oldWord = R.find(
              (w) =>
                R.equals(w.start, dragStart) &&
                (dragStart.x === dragEnd.x
                  ? w.end.x === dragEnd.x
                  : w.end.y === dragEnd.y),
              state.words
            )
            if (oldWord) {
              if (R.equals(oldWord.end, dragEnd)) {
                dispatch(removeWord(oldWord))
              } else {
                dispatch(changeWord(oldWord, newWord))
              }
            }
          }
          setDragStart(undefined)
          setDragEnd(undefined)
        }
      }}
    >
      {props.children}
    </div>
  )
}
