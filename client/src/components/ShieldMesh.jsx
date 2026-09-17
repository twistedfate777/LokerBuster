import React, { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { MeshTransmissionMaterial } from "@react-three/drei";

const ShieldMesh = ({ hovered, ...props }) => {
  const groupRef = useRef();
  const glassMatRef = useRef();
  const lightRef = useRef();
  const rivetRefs = useRef([]);


  const { frameShape, coreShape, frameExtrude, coreExtrude } = useMemo(() => {

    const frame = new THREE.Shape();
    frame.moveTo(0, 1.75); 
    frame.lineTo(1.55, 1.40); 
    frame.lineTo(1.55, -0.2); 
    frame.quadraticCurveTo(1.55, -1.6, 0, -2.8); 
    frame.quadraticCurveTo(-1.55, -1.6, -1.55, -0.2); 
    frame.lineTo(-1.55, 1.40); 
    frame.lineTo(0, 1.75);


    const core = new THREE.Shape();
    core.moveTo(0, 1.5);
    core.lineTo(1.25, 1.25);
    core.lineTo(1.25, -0.1); 
    core.quadraticCurveTo(1.25, -1.4, 0, -2.4);
    core.quadraticCurveTo(-1.25, -1.4, -1.25, -0.1);
    core.lineTo(-1.25, 1.25);
    core.lineTo(0, 1.5);


    const frameSettings = { 
      depth: 0.35, 
      bevelEnabled: true, 
      bevelSize: 0.08, 
      bevelThickness: 0.15, 
      bevelSegments: 6 
    };
    
    const coreSettings = { 
      depth: 0.15, 
      bevelEnabled: true, 
      bevelSize: 0.06, 
      bevelThickness: 0.08, 
      bevelSegments: 5 
    };
    
    return { frameShape: frame, coreShape: core, frameExtrude: frameSettings, coreExtrude: coreSettings };
  }, []);


  const rivetPositions = [
    [0, 1.63, 0.45], 
    [-1.4, 1.33, 0.45], 
    [1.4, 1.33, 0.45],
    [-1.4, -0.1, 0.45], 
    [1.4, -0.1, 0.45], 
    [0, -2.55, 0.45]
  ];

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    
    if (!groupRef.current || !glassMatRef.current || !lightRef.current) return;


    const targetScale = hovered ? 1.05 : 1;
    groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);

    //efek nyala
    if (hovered) {
      const pulse = 0.5 + Math.sin(t * 8) * 0.5; 
      glassMatRef.current.emissiveIntensity = THREE.MathUtils.lerp(glassMatRef.current.emissiveIntensity, 1.5 + pulse, 0.1);
      lightRef.current.intensity = THREE.MathUtils.lerp(lightRef.current.intensity, 6 + pulse * 2, 0.1);
    } else {

      glassMatRef.current.emissiveIntensity = THREE.MathUtils.lerp(glassMatRef.current.emissiveIntensity, 0.2, 0.1);
      lightRef.current.intensity = THREE.MathUtils.lerp(lightRef.current.intensity, 0, 0.1);
    }


    rivetRefs.current.forEach((mesh, i) => {
      if (mesh) {
        mesh.rotation.z = t * (i % 2 === 0 ? 1 : -1);
        mesh.material.emissiveIntensity = hovered ? 2 + Math.random() : 0.5;
      }
    });
  });

  return (
    <group ref={groupRef} {...props}>
      <pointLight ref={lightRef} color="#1ecfc1" distance={5} intensity={0} position={[0, 0, 0.5]} />

      <mesh position={[0, 0, -0.15]} castShadow receiveShadow>
        <extrudeGeometry args={[frameShape, frameExtrude]} />
        <meshStandardMaterial color="#101828" metalness={0.9} roughness={0.2} />
      </mesh>

      <mesh castShadow receiveShadow>
        <extrudeGeometry args={[coreShape, coreExtrude]} />
        <MeshTransmissionMaterial 
          ref={glassMatRef}
          backside 
          thickness={0.5} 
          roughness={0.05} 
          transmission={1} 
          ior={1.6} 
          color="#1ecfc1"
          emissive="#1ecfc1"
          emissiveIntensity={0.2}
          transparent
        />
      </mesh>

      {rivetPositions.map((pos, i) => (
        <group key={i} position={pos}>
          <mesh>
            <cylinderGeometry args={[0.06, 0.08, 0.04, 16]} rotation={[Math.PI / 2, 0, 0]} />
            <meshStandardMaterial color="#222222" metalness={1} roughness={0.4} />
          </mesh>
          <mesh position={[0, 0, 0.02]} ref={(el) => (rivetRefs.current[i] = el)}>
            <torusGeometry args={[0.03, 0.01, 8, 16]} />
            <meshStandardMaterial 
              color="#1ecfc1" 
              emissive="#1ecfc1" 
              toneMapped={false} 
            />
          </mesh>
        </group>
      ))}
    </group>
  );
};

export default ShieldMesh;