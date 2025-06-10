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
import * as THREE from 'three'
import { Canvas, useLoader, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { TextureLoader, PointLight } from 'three'
import { useRef, useEffect, useMemo } from 'react'

export default function CuboConImagen() {
  return (
    <div className='relative flex justify-center bg-[#11171a] w-full overflow-hidden h-full'>
      <div className="w-[50%] absolute z-10 flex">
        <div className='leading-[0.9] flex flex-col gap-6'>
          <h2 className=" font-extrabold text-[5rem] tracking-tighter text-pink-400">TITULO COSO</h2>
          <p className='font-mono font-light tracking-normal text-white'>Así, la luz siempre llega desde donde vos mirás, y la cara del cubo que está de frente siempre está bien iluminada, sin importar su orientación previa.</p>
        </div>
      </div>
      <Canvas
        style={{ background: 'black', touchAction: 'pan-y', }}
        camera={{ position: [0, 0, 8], fov: 50 }}
        
      /* gl={{ antialias: true }}
  onCreated={({ gl }) => {
    gl.setClearColor('black') // 🎯 Fondo negro
  }} */
      >
        {/* Luz suave general */}
        <ambientLight intensity={0.4} />
        {/* Luz que sigue al usuario */}
        <LuzEnCamara />
        <OrbitControls
          enableZoom={false}
          minPolarAngle={Math.PI / 2}
          maxPolarAngle={Math.PI / 2}
        />
        <CuboConTexturas />
      </Canvas>
    </div>
  )
}

/* function Cubo() {
  const texture = useLoader(TextureLoader, '/textures/raw.jpeg')

  return (
    <mesh>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  )
} */

function LuzEnCamara() {
  const { camera, scene } = useThree()
  const lightRef = useRef<PointLight>(null!)

  useEffect(() => {
    const light = lightRef.current
    camera.add(light)         // La luz se "monta" en la cámara
    scene.add(camera)         // ¡Importante! para que se renderice
  }, [camera, scene])

  return (
    <pointLight ref={lightRef} intensity={10} distance={10} />
  )
}

function CuboConTexturas() {
  // Cargar las 6 texturas para las caras
  const textures = useLoader(TextureLoader, [
    '/textures/3.6.5-musica.jpg', // derecha (+X)
    '/textures/3.6.6-meea.jpg', // izquierda (-X)
    '/textures/3.6.7-giselle.jpg', // arriba (+Y)
    '/textures/3.6.14-schutzenfest.jpg', // abajo (-Y)
    '/textures/3.10-musica-1b@2x.png', // frente (+Z)
    '/textures/3.10-zeitung-1b@2x.png', // atrás (-Z)
  ])

  // Crear 6 materiales con esas texturas
  const materials = useMemo(
    () => textures.map(tex => new THREE.MeshStandardMaterial({
      map: tex, transparent: true,        // ✅ activa la transparencia
      alphaTest: 0.5,           // opcional: recorta pixeles muy transparentes
      side: THREE.FrontSide,
    })),
    [textures]
  )

  return (
    <mesh material={materials}>
      <boxGeometry args={[2.4, 3.4, 2]} />
    </mesh>
  )
}