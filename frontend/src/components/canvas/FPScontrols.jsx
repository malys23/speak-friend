import { CapsuleCollider, RigidBody } from "@react-three/rapier";
import { useRef } from "react";
import * as THREE from "three";
import {useThree, useFrame } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";

const SPEED = 5;
const velocity = new THREE.Vector3();
const forwardDirectionVector = new THREE.Vector3();
const sidewaysDirectionVector = new THREE.Vector3();

const FPScontrols = () => {
    const [subscriveToKeys, getKeys] = useKeyboardControls();
    const rigidBodyRef = useRef();
    const { camera } = useThree();

    useFrame((state, delta) => {
        const{
            forwardKeyPressed,
            rightKeyPressed,
            backwardKeyPressed,
            leftKeyPressed
        } = getKeys();

        if(rigidBodyRef.current){
            const pos = rigidBodyRef.current.translation();
            camera.position.copy(pos);
            forwardDirectionVector.set(0,0, -forwardKeyPressed + backwardKeyPressed);
            sidewaysDirectionVector.set(rightKeyPressed - leftKeyPressed, 0, 0);

            velocity.addVectors(forwardDirectionVector, sidewaysDirectionVector);
            velocity.normalize();
            velocity.multiplyScalar(SPEED);
            velocity.multiplyScalar(delta*20);
            velocity.applyEuler(camera.rotation);

            rigidBodyRef.current.setLinvel({
                x: velocity.x,
                y: velocity.y * 0,
                z: velocity.z
            });
        }
    });

    return(
        <>
            <RigidBody
                ref = {rigidBodyRef}
                colliders={false}
                mass={1}
                friction={0}
                restitution={0}
                position = {[-0.1, 1, -0.4]}
                enabledRotations={[false, false, false]}
            >
                <CapsuleCollider args={[1.2, 0.25]}/>
            </RigidBody>
        </>
    );
};

export default FPScontrols;