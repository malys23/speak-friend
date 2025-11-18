import React, { useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { KeyboardControls, PointerLockControls } from "@react-three/drei";
import { Physics, Debug } from "@react-three/rapier";
import { EntranceDungeon } from "../assets/EntranceDungeon";


const EntranceCanvas = () => {
    const ref = useRef();
    return (
        <Canvas camera={{ position: [0, 1, 5] }} flat shadows dpr={[1, 2]}>
            <directionalLight position={[3,2,5]} intensity={10}/>
            <Physics>
                <Debug/>
                <EntranceDungeon/>
            </Physics>                                   
        </Canvas>
    );
}
export default EntranceCanvas;