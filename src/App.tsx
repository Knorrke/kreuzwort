import React from "react";
import "./App.css";
import { exampleState } from "./fixtures";
import { Grid } from './Grid'
import { reducer } from "./reducer";
import { initialState, StateContext } from "./StateContext";

function App() {
  const [state, dispatch] = React.useReducer(reducer, initialState)
  return (
    <div className="mx-auto sm:w-3/4 md:w-2/4 fixed inset-0 flex items-center justify-center">
      <div className="flex flex-col items-center justify-center">
        <StateContext.Provider value={{ state: state, dispatch: dispatch }}>
          <Grid showSolution />
          {/* <div className="m-4" />
          <Grid /> */}
        </StateContext.Provider>
      </div>
    </div>
  );
}

export default App;
