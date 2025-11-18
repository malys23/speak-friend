import React, { useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { PointerLockControls } from '@react-three/drei';
import { Physics, Debug } from '@react-three/rapier';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Canvas>
        <Physics>
          <Debug>

          </Debug>
        </Physics>
        <PointerLockControls/>
      </Canvas>
    </>
  )
}

export default App
