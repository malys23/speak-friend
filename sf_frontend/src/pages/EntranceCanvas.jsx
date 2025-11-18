import React, { useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { KeyboardControls, PointerLockControls, OrbitControls } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import { EntranceDungeon } from "../components/EntranceDungeon.jsx";
import FPScontrols from "../components/FPScontrols.jsx";


const EntranceCanvas = () => {
    const ref = useRef();
    return (
        <>
            <Canvas camera={{ position: [0, 1, 5] }} flat shadows dpr={[1, 2]}>
                <Physics>
                    <EntranceDungeon/>
                    <KeyboardControls
                        map={[
                            { name: "forwardKeyPressed", keys: ["ArrowUp", "KeyW"] },
                            { name: "rightKeyPressed", keys: ["ArrowRight", "KeyD"] },
                            { name: "backwardKeyPressed", keys: ["ArrowDown", "KeyS"] },
                            { name: "leftKeyPressed", keys: ["ArrowLeft", "KeyA"] }
                        ]}
                    >
                        <FPScontrols/>
                    </KeyboardControls>
                </Physics>
                <OrbitControls/>
                
                <ambientLight intensity={0.3} />
                <directionalLight intensity={1} position={[2, 7, 7]} />
                <directionalLight intensity={0.5} position={[-2, -7, -3]} />
            </Canvas>
        </>
    );
}
export default EntranceCanvas;