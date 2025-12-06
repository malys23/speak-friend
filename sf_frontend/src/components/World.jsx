import { RigidBody } from "@react-three/rapier";
const World = () => {
  return (
    <>
      <RigidBody type="fixed" friction={0} restitution={0}>
        {/**Floor */}
        <mesh>
          <boxGeometry args={[20, 0.1, 20]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
        {/*************** */}

        {/**Walls */}
        <mesh position={[10, 0.5, 0]}>
          <boxGeometry args={[0.1, 3, 20]} />
          <meshStandardMaterial color="#8899aa" />
        </mesh>
        <mesh position={[-10, 0.5, 0]}>
          <boxGeometry args={[0.1, 3, 20]} />
          <meshStandardMaterial color="#8899aa" />
        </mesh>
        <mesh position={[0, 0.5, 10]}>
          <boxGeometry args={[20, 3, 0.1]} />
          <meshStandardMaterial color="#8899aa" />
        </mesh>
        <mesh position={[0, 0.5, -10]}>
          <boxGeometry args={[20, 3, 0.1]} />
          <meshStandardMaterial color="#8899aa" />
        </mesh>
        {/*************** */}
      </RigidBody>
    </>
  );
};

export default World;