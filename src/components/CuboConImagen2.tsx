'use client'
import * as THREE from 'three'
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber'
import { TextureLoader, PointLight } from 'three'
import { useRef, useEffect, useMemo } from 'react'
import { useMotionValue, animate } from 'framer-motion'

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
        camera={{ position: [0, 0, 10], fov: 50 }}
      >
        <ambientLight intensity={0.5} />
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
    <pointLight ref={lightRef} intensity={100} distance={10} />
  )
}

function CuboConTexturas() {
  const meshRef = useRef<THREE.Mesh>(null!)
  
  // Ángulo rotación (en radianes)
  const rotationY = useMotionValue(0)
  const startX = useRef(0)
  const startY = useRef(0)
  const dragAccum = useRef(0)  // acumula el delta de drag
  
  // Estado para controlar si el gesto es horizontal o vertical
  const gestureDirection = useRef<'horizontal' | 'vertical' | 'undetermined'>('undetermined')
  const threshold = 10 // píxeles para determinar dirección

  const textures = useLoader(TextureLoader, [
    '/textures/3.6.5-musica.jpg',
    '/textures/3.6.6-meea.jpg',
    '/textures/3.6.7-giselle.jpg',
    '/textures/3.6.14-schutzenfest.jpg',
    '/textures/3.10-musica-1b@2x.png',
    '/textures/3.10-zeitung-1b@2x.png',
  ])

  const materials = useMemo(() => 
    textures.map(tex => new THREE.MeshStandardMaterial({
      map: tex,
      transparent: true,
      alphaTest: 0.5,
      side: THREE.FrontSide,
    })), [textures])

  // Eventos touch/mouse para drag horizontal
  useEffect(() => {
    let isDragging = false

    const onStart = (x: number, y: number) => {
      isDragging = true
      startX.current = x
      startY.current = y
      dragAccum.current = 0
      gestureDirection.current = 'undetermined'
      // cancelar animaciones previas si las hubiera
      rotationY.stop()
    }

    const onMove = (x: number, y: number, e: TouchEvent | MouseEvent) => {
      if (!isDragging) return
      
      const deltaX = x - startX.current
      const deltaY = y - startY.current
      
      // Determinar dirección del gesto si aún no está determinada
      if (gestureDirection.current === 'undetermined') {
        const absX = Math.abs(deltaX)
        const absY = Math.abs(deltaY)
        
        if (absX > threshold || absY > threshold) {
          gestureDirection.current = absX > absY ? 'horizontal' : 'vertical'
        }
      }
      
      // Si es gesto vertical, no interferir con el scroll
      if (gestureDirection.current === 'vertical') {
        return
      }
      
      // Si es gesto horizontal, prevenir el comportamiento por defecto y rotar el cubo
      if (gestureDirection.current === 'horizontal') {
        e.preventDefault()
        dragAccum.current += deltaX
        startX.current = x
        startY.current = y

        // Actualizo rotación proporcional al delta acumulado
        rotationY.set(rotationY.get() + deltaX * 0.01)  // ajustar sensibilidad
      }
    }

    const onEnd = () => {
      if (!isDragging) return
      isDragging = false

      // Solo hacer snap si fue un gesto horizontal
      if (gestureDirection.current === 'horizontal') {
        // Snapear a la rotación más cercana a múltiplos de 90 grados
        const currentRotation = rotationY.get()
        const snapTo = Math.round(currentRotation / (Math.PI / 2)) * (Math.PI / 2)

        // Animar suavemente a esa rotación con framer-motion
        animate(rotationY, snapTo, { type: 'spring', stiffness: 50, damping: 10 })
      }
      
      gestureDirection.current = 'undetermined'
    }

    // Listeners touch
    const touchStart = (e: TouchEvent) => onStart(e.touches[0].clientX, e.touches[0].clientY)
    const touchMove = (e: TouchEvent) => onMove(e.touches[0].clientX, e.touches[0].clientY, e)
    const touchEnd = () => onEnd()

    // Listeners mouse
    const mouseDown = (e: MouseEvent) => onStart(e.clientX, e.clientY)
    const mouseMove = (e: MouseEvent) => onMove(e.clientX, e.clientY, e)
    const mouseUp = () => onEnd()

    window.addEventListener('touchstart', touchStart, { passive: true })
    window.addEventListener('touchmove', touchMove, { passive: false })
    window.addEventListener('touchend', touchEnd, { passive: true })
    window.addEventListener('mousedown', mouseDown)
    window.addEventListener('mousemove', mouseMove)
    window.addEventListener('mouseup', mouseUp)

    return () => {
      window.removeEventListener('touchstart', touchStart)
      window.removeEventListener('touchmove', touchMove)
      window.removeEventListener('touchend', touchEnd)
      window.removeEventListener('mousedown', mouseDown)
      window.removeEventListener('mousemove', mouseMove)
      window.removeEventListener('mouseup', mouseUp)
    }
  }, [rotationY])

  // Actualizo la rotación del cubo en cada frame
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y = rotationY.get()
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
