import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer, Float } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

function Frame() {
  const g = useRef<THREE.Group>(null);
  useFrame((state, delta) => {
    if (!g.current) return;
    const dt = Math.min(delta, 0.05);
    g.current.rotation.y += dt * 0.25;
    g.current.rotation.x = THREE.MathUtils.lerp(g.current.rotation.x, state.pointer.y * -0.3, 0.05);
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, state.pointer.x * 1.2, 0.04);
    state.camera.lookAt(0, 0, 0);
  });
  const frameMat = <meshPhysicalMaterial color="#1f1f1d" roughness={0.25} metalness={0.4} clearcoat={1} />;
  const goldMat = <meshStandardMaterial color="#c9a25a" metalness={1} roughness={0.2} />;
  const lens = (
    <meshPhysicalMaterial color="#e9f5c8" transmission={1} thickness={0.3} roughness={0.05} ior={1.5} transparent opacity={0.9} />
  );
  return (
    <group ref={g} scale={1.1}>
      {[-1.15, 1.15].map((x) => (
        <group key={x} position={[x, 0, 0]}>
          <mesh>
            <torusGeometry args={[0.85, 0.09, 24, 80]} />
            {frameMat}
          </mesh>
          <mesh>
            <circleGeometry args={[0.8, 64]} />
            {lens}
          </mesh>
          <mesh position={[x > 0 ? 0.9 : -0.9, 0.15, -1.1]} rotation={[0, Math.PI / 2, 0]}>
            <boxGeometry args={[2.2, 0.08, 0.05]} />
            {frameMat}
          </mesh>
          <mesh position={[x > 0 ? 0.88 : -0.88, 0.15, 0]}>
            <sphereGeometry args={[0.1, 16, 16]} />
            {goldMat}
          </mesh>
        </group>
      ))}
      <mesh position={[0, 0.25, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.3, 0.06, 16, 40, Math.PI]} />
        {goldMat}
      </mesh>
    </group>
  );
}

export default function Glasses3D() {
  return (
    <Canvas camera={{ position: [0, 0.4, 6], fov: 40 }} dpr={[1, 2]} gl={{ alpha: true, antialias: true }}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 4, 5]} intensity={1.5} />
      <Float speed={1.5} floatIntensity={0.6} rotationIntensity={0.2}>
        <Frame />
      </Float>
      <Environment resolution={256}>
        <Lightformer intensity={2} position={[0, 5, 0]} scale={[10, 10, 1]} />
        <Lightformer intensity={1.2} color="#f3dfb0" position={[-5, 1, -1]} rotation-y={Math.PI / 2} scale={[20, 1, 1]} />
        <Lightformer intensity={1} color="#a8d36b" position={[5, -1, 1]} rotation-y={-Math.PI / 2} scale={[20, 1, 1]} />
      </Environment>
    </Canvas>
  );
}
