import React, { useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { PointerLockControls, OrbitControls } from '@react-three/drei';
import { Physics } from '@react-three/rapier';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import EntranceCanvas from './components/EntranceCanvas.jsx';

const App = () => {
  const ref = useRef();

  return (
    <>
      <Canvas camera={{ position: [0, 1, 5] }} flat shadows dpr={[1, 2]}>
        <ambientLight intensity={0.3} />
        <directionalLight intensity={1} position={[2, 7, 7]} />
        <directionalLight intensity={0.5} position={[-2, -7, -3]} />
        <mesh>
          <boxGeometry args={[20, 0.1, 20]} />
          <meshStandardMaterial color="#5d9955" />
        </mesh>
        <OrbitControls/>
      </Canvas>
    </>
  );
}

export default App;
