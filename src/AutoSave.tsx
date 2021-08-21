import React from 'react'
import { State } from './reducer';
import { StateContext } from "./StateContext";

export function AutoSave() {
  const { state } = React.useContext(StateContext)
  React.useEffect(() => {
    window.localStorage['kreuzwort'] = JSON.stringify(state)
  }, [state])
  return <></>
}

export function loadSavedState() {
  if (window.localStorage['kreuzwort']) return JSON.parse(window.localStorage['kreuzwort']) as State
}