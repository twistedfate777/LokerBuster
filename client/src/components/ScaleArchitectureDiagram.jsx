import React, { useRef } from "react";
import * as THREE from "three";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import {
  Text,
  RenderTexture,
  OrthographicCamera,
  Edges,
  Environment,
} from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { title } from "framer-motion/client";

const Pedestal = ({ position, title, gridColor = "#5555ff", children }) => {
  return (
    <group position={position}>
      <mesh position={[0, 0.4, 0]}>
        <boxGeometry args={[3, 0.8, 3]} />
        <meshStandardMaterial color="#0a0a0c" roughness={0.8} metalness={0.2} />
        <Edges scale={1.01} color="#333333" />
      </mesh>

      <mesh position={[0, 2.3, 0]}>
        <boxGeometry args={[1.8, 3, 1.8]} />
        <meshStandardMaterial color="#14141c" roughness={0.7} metalness={0.3} />
        <Edges scale={1.02} color="#222222" />
      </mesh>

      <mesh position={[0, 3.81, 0]}>
        <planeGeometry args={[1.8, 1.8]} />
        <meshBasicMaterial
          color={gridColor}
          wireframe
          transparent
          opacity={0.4}
        />
      </mesh>

      <Text
        position={[0, 0.4, 1.55]}
        fontSize={0.25}
        color="#ffffff"
        anchorX="center"
        material-toneMapped={false}
      >
        {title}
      </Text>

      <group position={[0, 3.8, 0]}>{children}</group>
    </group>
  );
};

// data entry
const DataEntryNode = ({ position }) => {
  return (
    <Pedestal position={position} title={"DATA ENTRY"} gridColor="#5555ff">
      {/* tumpukan kertas */}
      {[0, 0.2, 0.4, 0.6].map((offset, i) => (
        <mesh key={i} position={[0, 0.5 + offset, 0]}>
          <boxGeometry args={[1.6, 0.15, 1.2]} />
          <meshStandardMaterial
            color={i % 2 === 0 ? "#ffffff" : "#e0e0e0"}
            roughness={0.5}
          />
          <Edges scale={1.01} color="#cccccc" />
        </mesh>
      ))}

      <mesh position={[0, 0.3, 0]}>
        <boxGeometry args={[1.8, 0.8, 1.8]} />
        <meshStandardMaterial color="#2a2a35" roughness={0.4} metalness={0.6} />
        <Edges scale={1.02} color="#5555ff" />
      </mesh>

      <Text
        position={[0, 0.3, 1]}
        fontSize={0.27}
        color="#ffffff"
        anchorX="center"
        material-toneMapped={false}
      >
        JOB LISTINGS
      </Text>

      <group position={[0, 1.3, 0]}>
        {[-0.4, 0, 0.4].map((x, i) => (
          <mesh key={i} position={[x, 0, 0]}>
            <boxGeometry args={[0.2, (i + 1) * 0.3, 0.1]} />
            <meshBasicMaterial color="#5555ff" />
          </mesh>
        ))}
      </group>
    </Pedestal>
  );
};

// deep scan
const AIDeepScanNode = ({ position }) => {
  const scannerRef = useRef();

  useFrame((state) => {
    if (scannerRef.current) {
      scannerRef.current.position.y =
        1.5 + Math.sin(state.clock.elapsedTime * 2) * 0.2;
    }
  });

  return (
    <Pedestal position={position} title={"AI DeepScan"} gridColor="#00ffcc">
      <mesh position={[0, 0.4, 0]}>
        <boxGeometry args={[1.8, 0.8, 2]} />
        <meshStandardMaterial color="#1a1a24" roughness={0.7} metalness={0.3} />
        <Edges scale={1.02} color="#00ffcc" />
      </mesh>

      <group ref={scannerRef}>
        <mesh>
          <boxGeometry args={[2.2, 0.05, 2.2]} />

          <meshStandardMaterial
            color="#00ffcc"
            transparent
            opacity={0.3}
            roughness={0.1}
            side={THREE.DoubleSide}
          />
        </mesh>
        <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[2.2, 2.2]} />
          <meshBasicMaterial color="#00ffcc" transparent opacity={0.4} />
        </mesh>
      </group>

      <Text
        position={[0, 0.4, 1.02]}
        fontSize={0.25}
        color="#00ffcc"
        anchorX="center"
        material-toneMapped={false}
      >
        AI DEEP SCAN
      </Text>
    </Pedestal>
  );
};

// safety verdict
const SafetyVerdictNode = ({ position }) => {
  const lockRef = useRef();
  const ringRef = useRef();

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    if (lockRef.current) {
      lockRef.current.position.y = 2.0 + Math.sin(t * 2) * 0.15;
    }

    // ring yang muterin padlock
    if (ringRef.current) {
      ringRef.current.rotation.z = t * 1.5;
      ringRef.current.position.y = 2.0 + Math.cos(t * 1.5) * 0.4;
    }
  });

  return (
    <Pedestal position={position} title={"Safety Verdict"} gridColor="#00ff44">
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[1.2, 1.4, 0.8, 8]} />
        <meshStandardMaterial color="#121218" roughness={0.5} metalness={0.8} />
        <Edges scale={1.02} color="#00ff44" />
      </mesh>

      <group
        ref={ringRef}
        position={[0, 2.0, 0]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <mesh>
          <torusGeometry args={[1.1, 0.02, 16, 64]} />
          <meshBasicMaterial color="#00ff44" transparent opacity={0.6} />
        </mesh>

        <mesh position={[1.1, 0, 0]}>
          <boxGeometry args={[0.2, 0.05, 0.05]} />
          <meshBasicMaterial color="#00ff44" />
        </mesh>
        <mesh position={[-1.1, 0, 0]}>
          <boxGeometry args={[0.2, 0.05, 0.05]} />
          <meshBasicMaterial color="#00ff44" />
        </mesh>
      </group>

      <group ref={lockRef} position={[0, 2.0, 0]}>
        {/* Padlock */}
        <mesh position={[0, -0.2, 0]}>
          <boxGeometry args={[1, 0.8, 0.4]} />
          <meshStandardMaterial
            color="#1a1a24"
            roughness={0.4}
            metalness={0.9}
          />
          <Edges scale={1.02} color="#00ff44" />
        </mesh>

        <group position={[0, -0.25, 0.21]}>
          <mesh position={[0, 0.1, 0]}>
            <circleGeometry args={[0.12, 32]} />
            <meshBasicMaterial color="#00ff44" />
          </mesh>
          <mesh position={[0, -0.05, 0]}>
            <planeGeometry args={[0.1, 0.2]} />
            <meshBasicMaterial color="#00ff44" />
          </mesh>
        </group>

        <mesh position={[0, 0.2, 0]}>
          <torusGeometry args={[0.35, 0.1, 16, 32, Math.PI]} />
          <meshStandardMaterial
            color="#00ff44"
            roughness={0.2}
            metalness={0.8}
          />
        </mesh>
      </group>

      <group position={[0, 3.4, 0]}>
        <mesh position={[0, 0, -0.05]}>
          <planeGeometry args={[2.5, 0.5]} />
          <meshBasicMaterial color="#004411" transparent opacity={0.3} />
          <Edges scale={1.0} color="#00ff44" />
        </mesh>

        <Text
          position={[0, 0, 0]}
          fontSize={0.25}
          color="#00ff44"
          anchorX="center"
          anchorY="middle"
          material-toneMapped={false}
        >
          STATUS: SECURE
        </Text>
      </group>
    </Pedestal>
  );
};

// Main Scene
const LockerBusterScene = ({ hoverObject }) => {
  const groupRef = useRef();

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y =
        Math.sin(state.clock.elapsedTime * 0.8) * 0.05 - 0.5;
    }
  });

  return (
    <group ref={groupRef} position={[0, -1, 0]}>
      <mesh position={[0, -0.5, 0]}>
        <boxGeometry args={[14, 0.8, 6]} />
        <meshStandardMaterial color="#0a0a0c" roughness={0.8} metalness={0.2} />
        <Edges scale={1.002} color="#333333" />
      </mesh>

      <Text
        position={[-3.5, -0.5, 3.02]}
        fontSize={0.4}
        color="#ffffff"
        anchorX="left"
        material-toneMapped={false}
      >
        LOCKERBUSTER CORE COMPONENTS
      </Text>

      <group position={[0, 0, 0]}>
        {(hoverObject == 1 || hoverObject == null) && (
          <DataEntryNode position={[-4.5, 0, 0]} />
        )}
        {(hoverObject == 2 || hoverObject == null) && (
          <AIDeepScanNode position={[0, 0, 0]} />
        )}
        {(hoverObject == 3 || hoverObject == null) && (
          <SafetyVerdictNode position={[4.5, 0, 0]} />
        )}
      </group>
    </group>
  );
};

const DiagramPlane = ({ hoverObject }) => {
  const { viewport } = useThree();

  return (
    <mesh>
      <planeGeometry args={[viewport.width, viewport.height]} />
      <meshBasicMaterial transparent={true}>
        <RenderTexture attach="map" anisotropy={4}>
          <OrthographicCamera
            makeDefault
            manual
            zoom={25}
            position={[20, 20, 20]}
            onUpdate={(c) => c.lookAt(0, 0, 0)}
          />

          <ambientLight intensity={1.5} />
          <directionalLight
            position={[10, 20, 10]}
            intensity={3}
            color="#ffffff"
          />
          <directionalLight
            position={[-10, -10, 10]}
            intensity={1}
            color="#6666dd"
          />

          <Environment preset="city" blur={1} />
          <LockerBusterScene hoverObject={hoverObject} />

          <EffectComposer disableNormalPass multisampling={0}>
            <Bloom
              luminanceThreshold={0.5}
              luminanceSmoothing={0.9}
              intensity={0.4}
            />
          </EffectComposer>
        </RenderTexture>
      </meshBasicMaterial>
    </mesh>
  );
};

export default function ScaleArchitectureDiagram({ hoverObject }) {
  return (
    <div className="w-full h-[450px] bg-transparent rounded-3xl">
      <Canvas
        dpr={[1, 1.5]}
        gl={{
          alpha: true,
          antialias: false,
          powerPreference: "high-performance",
        }}
      >
        <DiagramPlane hoverObject={hoverObject} />
      </Canvas>
    </div>
  );
}
