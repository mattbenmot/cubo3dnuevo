/* 'use client'

import { Canvas, useLoader } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useState } from 'react'
import { TextureLoader } from 'three'
import { a, useSpring } from '@react-spring/three'

export default function CuboConImagen() {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[2, 2, 2]} />
      <OrbitControls />

      <CuboInteractivo />
    </Canvas>
  )
}

function CuboInteractivo() {
  const [hovered, setHovered] = useState(false)

  const texture = useLoader(TextureLoader, '/textures/820045317358699148.png')

  const { rotationY } = useSpring({
    rotationY: hovered ? 0.5 : 0,
    config: { mass: 1, tension: 180, friction: 12 },
  })

  return (
    <a.mesh
      rotation-y={rotationY}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial map={texture} />
    </a.mesh>
  )
} */

  'use client'

import { Canvas, useLoader } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { TextureLoader } from 'three'

export default function CuboConImagen() {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[2, 2, 2]} />
      <OrbitControls />

      <Cubo />
    </Canvas>
  )
}

function Cubo() {
  const texture = useLoader(TextureLoader, '/textures/820045317358699148.png')

  return (
    <mesh>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  )
}