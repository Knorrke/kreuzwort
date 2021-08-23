import classNames from 'classnames'
import * as R from 'ramda'
import { Pos, Word } from './reducer'

interface HighlightsProps {
  highlightHorizontal?: boolean
  highlightVertical?: boolean
  x: number
  y: number
  dragStart?: Pos
  dragEnd?: Pos
  dragColor: string
  horizontalWords: Word[]
  verticalWords: Word[]
}
interface HighlightProps {
  color: string
  vertical?: boolean
  start?: boolean
  middle?: boolean
  end?: boolean
}

export function Highlight(props: HighlightProps) {
  return (
    <div
      className={classNames('absolute', props.color, 'pointer-events-none', {
        'w-8': props.vertical,
        'h-10': props.vertical,
        'w-10': !props.vertical,
        'h-8': !props.vertical,
        'border-l-4': props.start || (props.vertical && props.middle),
        'border-t-4': props.start || (!props.vertical && props.middle),
        'border-r-4': props.end || (props.vertical && props.middle),
        'border-b-4': props.end || (!props.vertical && props.middle),
      })}
    />
  )
}

export function Highlights(props: HighlightsProps) {
  const { x, y, dragStart, dragEnd, dragColor, horizontalWords, verticalWords } = props
  return (
    <>
      {props.highlightVertical && (
        <Highlight
          vertical
          start={R.any((w) => x === w.start.x && y === w.start.y, verticalWords)}
          middle={R.any(
            (w) =>
              x === w.start.x &&
              x === w.end.x &&
              y >= w.start.y &&
              y <= w.end.y,
            verticalWords
          )}
          end={R.any((w) => x === w.end.x && y === w.end.y, verticalWords)}
          color="border-pink-400"
        />
      )}
      {props.highlightHorizontal && (
        <Highlight
          color="border-blue-400"
          start={R.any((w) => x === w.start.x && y === w.start.y, horizontalWords)}
          middle={R.any(
            (w) =>
              y === w.start.y &&
              y === w.end.y &&
              x >= w.start.x &&
              x <= w.end.x,
            horizontalWords
          )}
          end={R.any((w) => x === w.end.x && y === w.end.y, horizontalWords)}
        />
      )}
      {dragStart && (
        <Highlight
          vertical={dragStart?.x === dragEnd?.x}
          color={dragColor}
          start={x === dragStart?.x && y === dragStart?.y}
          middle={
            (dragStart?.y === dragEnd?.y &&
              y === dragStart?.y &&
              x >= dragStart?.x &&
              x <= dragEnd?.x) || // horizontal
            (dragStart?.x === dragEnd?.x &&
              x === dragStart?.x &&
              x === dragEnd?.x &&
              y >= dragStart?.y &&
              y <= dragEnd?.y) // vertical
          }
          end={x === dragEnd?.x && y === dragEnd?.y}
        />
      )}
    </>
  )
}
