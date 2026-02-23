import { Canvas } from "@react-three/fiber";
import { KeyboardControls, PointerLockControls, OrbitControls } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import { EntranceDungeon } from "../../components/canvas/EntranceDungeon.jsx";
import FPScontrols from "../../components/canvas/FPScontrols.jsx";

import World from "../../components/canvas/World.jsx";


const EntranceCanvas = () => {
    return (
        <>
            <Canvas camera={{ position: [0, 1, 5] }} flat shadows dpr={[1, 2]}>
                <Physics>
                    <World />
                    <EntranceDungeon position={[0,0.49,0]}/>
                    <KeyboardControls
                        map={[
                            { name: "forwardKeyPressed", keys: ["ArrowUp", "KeyW"] },
                            { name: "rightKeyPressed", keys: ["ArrowRight", "KeyD"] },
                            { name: "backwardKeyPressed", keys: ["ArrowDown", "KeyS"] },
                            { name: "leftKeyPressed", keys: ["ArrowLeft", "KeyA"] }
                        ]}
                    >
                        <FPScontrols position ={[0,0,0]}/>
                    </KeyboardControls>
                </Physics>

                <ambientLight intensity={0.3} />
                <directionalLight intensity={1} position={[2, 7, 7]} />
                <directionalLight intensity={0.5} position={[-2, -7, -3]} />

                <PointerLockControls/>
            </Canvas>
        </>
    );
}
export default EntranceCanvas;