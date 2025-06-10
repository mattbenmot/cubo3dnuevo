'use client'
import * as THREE from 'three'
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber'
import { TextureLoader, PointLight } from 'three'
import { useRef, useEffect, useMemo, useState } from 'react'

export default function CuboConImagen() {
  return (
    <div
      className='relative flex justify-center bg-[#11171a] w-full overflow-hidden h-full'
      style={{ touchAction: 'pan-y' }} // ✅ permite scroll vertical táctil
    >
      <div className="w-[50%] absolute z-10 flex">
        <div className='leading-[0.9] flex flex-col gap-6 '>
          <h2 className=" font-extrabold text-[5rem] tracking-tighter text-pink-400 opacity-[80%]">
            TITULO COSO
          </h2>
          <p className='font-mono font-light tracking-normal text-white opacity-[80%]'>
            Así, la luz siempre llega desde donde vos mirás, y la cara del cubo que está de frente siempre está bien iluminada, sin importar su orientación previa.
          </p>
        </div>
      </div>

      <Canvas
        style={{ background: 'black', touchAction: 'pan-y' }}
        camera={{ position: [0, 0, 8], fov: 50 }}
      >
        <ambientLight intensity={0.4} />
        <LuzEnCamara />
        <CuboConTexturas />
      </Canvas>
    </div>
  )
}

function LuzEnCamara() {
  const { camera, scene } = useThree()
  const lightRef = useRef<PointLight>(null!)

  useEffect(() => {
    const light = lightRef.current
    camera.add(light)
    scene.add(camera)
  }, [camera, scene])

  return (
    <pointLight ref={lightRef} intensity={10} distance={10} />
  )
}

function CuboConTexturas() {
  const meshRef = useRef<THREE.Mesh>(null!)
  const [rotationY, setRotationY] = useState(0)
  const startX = useRef(0)
  const currentRotation = useRef(0)
  const isDragging = useRef(false)

  const textures = useLoader(TextureLoader, [
    '/textures/3.6.5-musica.jpg',        // +X
    '/textures/3.6.6-meea.jpg',          // -X
    '/textures/3.6.7-giselle.jpg',       // +Y
    '/textures/3.6.14-schutzenfest.jpg', // -Y
    '/textures/3.10-musica-1b@2x.png',   // +Z
    '/textures/3.10-zeitung-1b@2x.png',  // -Z
  ])

  const materials = useMemo(
    () => textures.map(tex => new THREE.MeshStandardMaterial({
      map: tex,
      transparent: true,
      alphaTest: 0.5,
      side: THREE.FrontSide,
    })),
    [textures]
  )

  // 📱 Gesto horizontal en mobile (swipe para rotar)
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      startX.current = e.touches[0].clientX
    }

    const handleTouchMove = (e: TouchEvent) => {
      const deltaX = e.touches[0].clientX - startX.current
      const newRotation = currentRotation.current + deltaX * 0.005
      setRotationY(newRotation)
    }

    const handleTouchEnd = () => {
      currentRotation.current = rotationY
    }

    window.addEventListener('touchstart', handleTouchStart)
    window.addEventListener('touchmove', handleTouchMove)
    window.addEventListener('touchend', handleTouchEnd)

    return () => {
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleTouchEnd)
    }
  }, [rotationY])

  // 🖱️ Drag horizontal con mouse en desktop
  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      isDragging.current = true
      startX.current = e.clientX
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return
      const deltaX = e.clientX - startX.current
      const newRotation = currentRotation.current + deltaX * 0.005
      setRotationY(newRotation)
    }

    const handleMouseUp = () => {
      if (isDragging.current) {
        currentRotation.current = rotationY
        isDragging.current = false
      }
    }

    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)

    return () => {
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [rotationY])

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y = rotationY
    }
  })

  return (
    <mesh ref={meshRef} material={materials}>
      <boxGeometry args={[2.4, 3.4, 2]} />
    </mesh>
  )
}



/* function CuboConTexturas() {
  const meshRef = useRef<THREE.Mesh>(null!)
  const [rotationY, setRotationY] = useState(0)

  const textures = useLoader(TextureLoader, [
    '/textures/3.6.5-musica.jpg',        // +X
    '/textures/3.6.6-meea.jpg',          // -X
    '/textures/3.6.7-giselle.jpg',       // +Y
    '/textures/3.6.14-schutzenfest.jpg', // -Y
    '/textures/3.10-musica-1b@2x.png',   // +Z
    '/textures/3.10-zeitung-1b@2x.png',  // -Z
  ])

  const materials = useMemo(
    () => textures.map(tex => new THREE.MeshStandardMaterial({
      map: tex,
      transparent: true,
      alphaTest: 0.5,
      side: THREE.FrontSide,
    })),
    [textures]
  )

  // 📦 Rotar el cubo en base al scroll horizontal
  useEffect(() => {
    const handleScroll = () => {
      setRotationY(window.scrollX * 0.01)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y = rotationY
    }
  })

  return (
    <mesh ref={meshRef} material={materials}>
      <boxGeometry args={[2.4, 3.4, 2]} />
    </mesh>
  )
} */
