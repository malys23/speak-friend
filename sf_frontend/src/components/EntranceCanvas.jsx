import React, { useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { KeyboardControls, PointerLockControls, OrbitControls } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import { EntranceDungeon } from "../assets/EntranceDungeon.jsx";


const EntranceCanvas = () => {
    const ref = useRef();
    return (
        <>
            <Canvas camera={{ position: [0, 1, 5] }} flat shadows dpr={[1, 2]}>
                <directionalLight position={[3,2,5]} intensity={10}/>
                <EntranceDungeon/>
                <OrbitControls/>
            </Canvas>
        </>
    );
}
export default EntranceCanvas;