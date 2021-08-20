import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { Grid, GridProps, word } from "./Grid";

const exampleState: GridProps = {
  grid: [
    ["", "A", "N", "D"],
    ["", "M", "O", "S"],
    ["B", "O", "W", "L"],
  ],
  words: [
    word(0, 0, 2, 0),
    word(1, 1, 2, 1),
    word(-1, 2, 3, 2),
    word(0, 0, 0, 1),
    word(1, 0, 1, 2),
    word(2, 1, 2, 3),
  ],
  offsetX: 1,
  offsetY: 0,
};

function App() {
  return (
    <div className="">
      <Grid {...exampleState} />
    </div>
  );
}

export default App;
