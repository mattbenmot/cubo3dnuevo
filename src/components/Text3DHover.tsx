'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, Center, Text3D } from '@react-three/drei'
import { useState } from 'react'
import { a, useSpring } from '@react-spring/three'

export default function Text3DHover() {
  return (
    <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} />

      <Center>
        <HoverText />
      </Center>

      <OrbitControls />
    </Canvas>
  )
}

function HoverText() {
  const [hovered, setHovered] = useState(false)

  const springs = useSpring({
    rotationX: hovered ? 0 : 0,
    rotationY: hovered ? 0.5 : 0,
    rotationZ: hovered ? 0 : 0,
    config: { mass: 1, tension: 180, friction: 12 },
  })

  return (
    <a.group
      rotation-x={springs.rotationX}
      rotation-y={springs.rotationY}
      rotation-z={springs.rotationZ}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <Text3D
        font="/fonts/Montserrat_Bold.json"
        size={1}
        height={0.4}
        curveSegments={12}
        bevelEnabled
        bevelThickness={0.03}
        bevelSize={0.02}
        bevelSegments={5}
      >
        Hola 3D
        <meshStandardMaterial color={hovered ? '#d9ccef' : '#f1b257'} />
      </Text3D>
    </a.group>
  )
}
