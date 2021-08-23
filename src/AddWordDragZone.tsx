import React from "react"
import { addWord, Pos, word } from "./reducer"
import { StateContext } from "./StateContext"

interface MarkWordDropZone {
  x: number
  y: number
  dragStart?: Pos
  setDragStart: (newpos: Pos|undefined) => void
  dragEnd?: Pos
  setDragEnd: (newpos: Pos|undefined) => void
}
export function MarkWordDragZone(props : React.PropsWithChildren<MarkWordDropZone>) {
  const [dragImg] = React.useState(() => {
    const dragImg = new Image(0, 0)
    dragImg.src =
      'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
    return dragImg
  })
  const { x,y, dragStart, setDragStart, dragEnd, setDragEnd  } = props
  const { dispatch } = React.useContext(StateContext)
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
      onDragEnd={() => {
        if (dragStart && dragEnd) {
          dispatch(
            addWord(word(dragStart.x, dragStart.y, dragEnd.x, dragEnd.y))
          )
          setDragStart(undefined)
          setDragEnd(undefined)
        }
      }}
    >
      {props.children}
    </div>
  )
}
