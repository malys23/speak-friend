import { React, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';

export function EntranceBook(props) {
  const { nodes, materials } = useGLTF('models/OpenBook.glb')
  const ref = useRef()

  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.OpenBook.geometry}
        material={materials['Dungeon_Mat_01.012']}
        position={[-0.753, -1.55, 4.05]}
        rotation={[1.52, 0.005, -0.346]}
        ref={ref}
      />
    </group>
  )
}

useGLTF.preload('models/OpenBook.glb')