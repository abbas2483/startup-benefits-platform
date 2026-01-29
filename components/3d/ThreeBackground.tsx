'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import * as random from 'maath/random'

function Stars(props: any) {
  const ref = useRef<any>()
  const sphere = useMemo(() => random.inSphere(new Float32Array(5000), { radius: 1.5 }), [])

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 10
      ref.current.rotation.y -= delta / 15
    }
  })

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
        <PointMaterial
          transparent
          color="#0ea5e9"
          size={0.002}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>
    </group>
  )
}

export default function ThreeBackground() {
  return (
    <div className="fixed top-0 left-0 w-full h-screen pointer-events-none" style={{ zIndex: 0 }}>
      <Canvas camera={{ position: [0, 0, 1] }} style={{ opacity: 0.4 }}>
        <Stars />
      </Canvas>
    </div>
  )
}
