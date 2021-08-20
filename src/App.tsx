import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { Grid, GridProps, word } from "./Grid";

const exampleState: GridProps = {
  grid: [
    ['', 'A', 'N', 'D'],
    ['', 'M', 'O', 'K'],
    ['B', 'O', 'W', 'L'],
  ],
  words: [
    word(0, 0, 2, 0),
    word(1, 1, 2, 1),
    word(-1, 2, 3, 2),
    word(0, 0, 0, 1),
    word(1, 0, 1, 2),
    word(2, 1, 2, 2),
  ],
  offsetX: 1,
  offsetY: 0,
};

function App() {
  return (
    <div className="mx-auto sm:w-3/4 md:w-2/4 fixed inset-0 flex items-center justify-center">
      <div className="flex flex-col items-center justify-center">
        <Grid {...exampleState} />
      </div>
    </div>
  );
}

export default App;
