import React, { useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { KeyboardControls, PointerLockControls } from "@react-three/drei";
import { Physics, Debug } from "@react-three/rapier";
import { EntranceDungeon } from "../assets/EntranceDungeon";


const EntranceCanvas = () => {
    const ref = useRef();
    return (
        <>
            <Canvas>
                <Physics>
                    <Debug/>
                    <EntranceDungeon/>
                </Physics>
                <ambientLight intensity={0.3} />

                <directionalLight intensity={1} position={[2, 7, 7]} />
                <directionalLight intensity={0.5} position={[-2, -7, -3]} />

                <PointerLockControls />                                         
            </Canvas>
        </>
    );
}
export default EntracnceCanvas;