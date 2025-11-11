import { Environment, OrbitControls } from '@react-three/drei';
import {Canvas} from '@react-three/fiber';
import React from 'react';
import './App.css';

import EntranceCanvas from './components/EntranceCanvas';
   
const App = () =>  {
  return (
    <EntranceCanvas/>
  )
}

export default App;