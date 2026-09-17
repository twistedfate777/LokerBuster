import React, { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, Center, Float } from "@react-three/drei";
import * as THREE from "three";
import ShieldMesh from "./ShieldMesh";

const InteractiveScene = () => {
  const groupRef = useRef();
  const [isHovered, setIsHovered] = useState(false);

  useFrame((state) => {
    if (!groupRef.current) return;

    let targetX = 0;
    let targetY = 0;


    if (isHovered) {
      targetX = -state.pointer.y * 0.5; 
      targetY = state.pointer.x * 0.5; 


      targetX = THREE.MathUtils.clamp(targetX, -Math.PI / 6, Math.PI / 6);
      targetY = THREE.MathUtils.clamp(targetY, -Math.PI / 4, Math.PI / 4);
    }


    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetX, 0.05);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetY, 0.05);
  });

  return (
    <group ref={groupRef}>
      <Float speed={1.2} rotationIntensity={0.1} floatIntensity={0.3}>
        <Center>
          <group
            onPointerOver={() => setIsHovered(true)}
            onPointerOut={() => setIsHovered(false)}
          >

            <ShieldMesh hovered={isHovered} position={[0, 0, 0]} scale={1.1} />
          </group>
        </Center>
      </Float>
    </group>
  );
};

export default function ShieldContainer() {
  return (
    <div className="w-full h-full ">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>

        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <directionalLight position={[-5, 2, 5]} intensity={0.8} />

        <InteractiveScene />

        <Environment preset="city" />
        
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          enableRotate={false}
        />
      </Canvas>
    </div>
  );
}