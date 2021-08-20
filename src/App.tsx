import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Grid, GridProps } from './Grid';

const exampleState : GridProps = {
  width: 3,
  height: 3,
  horizontal: [{word: 'ABC', x:0, y:0}, {word: 'DE', x:1, y:1}, {word: 'FGHI', x:-1, y: 2}],
  vertical: [{word: 'AD', x:0, y:0}]
}

function App() {
  return (
    <div className="">
      <Grid {...exampleState} />
    </div>
  );
}

export default App;
