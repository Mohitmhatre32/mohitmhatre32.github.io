import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const PARTICLE_COUNT = 800;

function ParticleField() {
  const meshRef = useRef<THREE.Points>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  const { positions, velocities, colors } = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const velocities = new Float32Array(PARTICLE_COUNT * 3);
    const colors = new Float32Array(PARTICLE_COUNT * 3);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 20;
      positions[i3 + 1] = (Math.random() - 0.5) * 20;
      positions[i3 + 2] = (Math.random() - 0.5) * 10;

      velocities[i3] = (Math.random() - 0.5) * 0.005;
      velocities[i3 + 1] = (Math.random() - 0.5) * 0.005;
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.002;

      // Warm amber to gold color palette
      const t = Math.random();
      colors[i3] = 0.8 + t * 0.2;     // R
      colors[i3 + 1] = 0.5 + t * 0.3; // G
      colors[i3 + 2] = 0.1 + t * 0.2; // B
    }

    return { positions, velocities, colors };
  }, []);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const geo = meshRef.current.geometry;
    const pos = geo.attributes.position.array as Float32Array;
    const time = clock.elapsedTime;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      pos[i3] += velocities[i3] + Math.sin(time * 0.3 + i * 0.01) * 0.002;
      pos[i3 + 1] += velocities[i3 + 1] + Math.cos(time * 0.2 + i * 0.01) * 0.002;
      pos[i3 + 2] += velocities[i3 + 2];

      // Wrap around
      if (Math.abs(pos[i3]) > 10) pos[i3] *= -0.9;
      if (Math.abs(pos[i3 + 1]) > 10) pos[i3 + 1] *= -0.9;
      if (Math.abs(pos[i3 + 2]) > 5) pos[i3 + 2] *= -0.9;
    }

    geo.attributes.position.needsUpdate = true;
    meshRef.current.rotation.y = time * 0.02;
    meshRef.current.rotation.x = Math.sin(time * 0.01) * 0.1;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={PARTICLE_COUNT}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={PARTICLE_COUNT}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        vertexColors
        transparent
        opacity={0.7}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

function FloatingOrbs() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.elapsedTime;
    groupRef.current.children.forEach((child, i) => {
      child.position.y = Math.sin(t * 0.5 + i * 2) * 0.5;
      child.position.x = Math.cos(t * 0.3 + i * 1.5) * 0.3 + (i - 1) * 3;
    });
  });

  return (
    <group ref={groupRef}>
      {[0, 1, 2].map(i => (
        <mesh key={i} position={[(i - 1) * 3, 0, -2]}>
          <sphereGeometry args={[0.15 + i * 0.05, 16, 16]} />
          <meshBasicMaterial
            color={new THREE.Color().setHSL(0.1 + i * 0.02, 0.8, 0.5 + i * 0.1)}
            transparent
            opacity={0.3}
          />
        </mesh>
      ))}
    </group>
  );
}

const HeroScene = () => {
  return (
    <div className="absolute inset-0">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.2} />
        <ParticleField />
        <FloatingOrbs />
      </Canvas>
    </div>
  );
};

export default HeroScene;
