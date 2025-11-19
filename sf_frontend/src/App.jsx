import React, { useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { PointerLockControls, OrbitControls } from '@react-three/drei';
import { Physics } from '@react-three/rapier';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import EntranceCanvas from './pages/EntranceCanvas.jsx';

const App = () => {
  const ref = useRef();

  return (
    <EntranceCanvas/>
  );
}

export default App;
