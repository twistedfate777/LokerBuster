import React, { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { MeshTransmissionMaterial } from "@react-three/drei";

const ShieldMesh = ({ hovered, ...props }) => {
  const groupRef = useRef();
  const glassMatRef = useRef();
  const lightRef = useRef();
  const backLightRef = useRef();
  const backGlowRef = useRef();
  const rivetRefs = useRef([]);

  const glowTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;

    const context = canvas.getContext("2d");
    const gradient = context.createRadialGradient(128, 128, 0, 128, 128, 128);
    gradient.addColorStop(0, "rgba(30, 207, 193, 1)");
    gradient.addColorStop(0.35, "rgba(30, 207, 193, 0.55)");
    gradient.addColorStop(0.65, "rgba(30, 207, 193, 0.18)");
    gradient.addColorStop(1, "rgba(30, 207, 193, 0)");
    context.fillStyle = gradient;
    context.fillRect(0, 0, 256, 256);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }, []);

  useEffect(() => () => glowTexture.dispose(), [glowTexture]);


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

    if (
      !groupRef.current ||
      !glassMatRef.current ||
      !lightRef.current ||
      !backLightRef.current ||
      !backGlowRef.current
    ) return;


    const targetScale = hovered ? 1.05 : 1;
    groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);

    //efek nyala
    if (hovered) {
      const pulse = 0.5 + Math.sin(t * 8) * 0.5;
      glassMatRef.current.emissiveIntensity = THREE.MathUtils.lerp(glassMatRef.current.emissiveIntensity, 1.5 + pulse, 0.1);
      lightRef.current.intensity = THREE.MathUtils.lerp(lightRef.current.intensity, 8 + pulse * 3, 0.1);
      backLightRef.current.intensity = THREE.MathUtils.lerp(backLightRef.current.intensity, 4 + pulse * 1.5, 0.1);
      backGlowRef.current.material.opacity = THREE.MathUtils.lerp(backGlowRef.current.material.opacity, 0.68 + pulse * 0.15, 0.1);
    } else {

      glassMatRef.current.emissiveIntensity = THREE.MathUtils.lerp(glassMatRef.current.emissiveIntensity, 0.2, 0.1);
      lightRef.current.intensity = THREE.MathUtils.lerp(lightRef.current.intensity, 0, 0.1);
      backLightRef.current.intensity = THREE.MathUtils.lerp(backLightRef.current.intensity, 0, 0.1);
      backGlowRef.current.material.opacity = THREE.MathUtils.lerp(backGlowRef.current.material.opacity, 0, 0.1);
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
      <pointLight ref={backLightRef} color="#1ecfc1" distance={5} intensity={0} position={[0, 0, -0.8]} />
      <sprite ref={backGlowRef} position={[0, 0, -0.65]} scale={[6.8, 7.2, 1]}>
        <spriteMaterial
          map={glowTexture}
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </sprite>

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