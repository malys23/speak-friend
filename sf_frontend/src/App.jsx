import React, { useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { PointerLockControls } from '@react-three/drei';
import { Physics, Debug } from '@react-three/rapier';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import EntranceCanvas from './components/EntranceCanvas.jsx';

const App = () => {
  const ref = useRef();

  return (
    <EntranceCanvas/>
  )
}

export default App;
