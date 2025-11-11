import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PointerLockControls } from '@react-three/drei';
import * as THREE from 'three';

export function FirstPersonRig({
  minYaw = -Math.PI/2,   // left limit = -90°
  maxYaw = Math.PI/2,    // right limit = +90°
  minPitch = -Math.PI/6, // look down limit = -30°
  maxPitch = Math.PI/3   // look up limit = +60°
}) {
  const { camera, gl } = useThree();
  const yawObject = useRef(new THREE.Object3D());
  const pitchObject = useRef(new THREE.Object3D());

  useEffect(() => {
    // Build hierarchy: yawObject → pitchObject → camera
    yawObject.current.add(pitchObject.current);
    pitchObject.current.add(camera);

    // Position camera at appropriate height
    camera.position.set(0, 1.6, 0); // e.g., 1.6m eye height
    // Add yawObject to scene
    gl.scene.add(yawObject.current);

    return () => {
      gl.scene.remove(yawObject.current);
    };
  }, [camera, gl]);

  // Track yaw & pitch values
  let yaw = 0;
  let pitch = 0;

  useFrame((_, delta) => {
    const moveX = gl.domElement._lastMovementX || 0;
    const moveY = gl.domElement._lastMovementY || 0;
    // You might need custom listener to set movementX/movementY

    const yawSpeed = 0.002;
    const pitchSpeed = 0.002;

    yaw   -= moveX * yawSpeed;
    pitch -= moveY * pitchSpeed;

    // Clamp
    yaw   = THREE.MathUtils.clamp(yaw,   minYaw,   maxYaw);
    pitch = THREE.MathUtils.clamp(pitch, minPitch, maxPitch);

    // Apply rotations
    yawObject.current.rotation.y   = yaw;
    pitchObject.current.rotation.x = pitch;
  });

  return <PointerLockControls />;
}