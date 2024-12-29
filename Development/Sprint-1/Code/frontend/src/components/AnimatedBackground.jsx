'use client'

import { Canvas } from '@react-three/fiber'
import { Environment, Float, OrbitControls } from '@react-three/drei'

function Background() {
  return (
    <mesh scale={100}>
      <sphereGeometry args={[1, 64, 64]} />
      <meshStandardMaterial color="#e0e0e0" side={2} />
    </mesh>
  )
}

function FloatingCube() {
  return (
    <Float speed={1.5} rotationIntensity={1} floatIntensity={2}>
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#4f46e5" />
      </mesh>
    </Float>
  )
}

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 z-0">
      <Canvas>
        <OrbitControls enableZoom={false} />
        <Background />
        <FloatingCube />
        <Environment preset="city" />
      </Canvas>
    </div>
  )
}

