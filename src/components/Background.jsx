import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

function Particles() {
    const ref = useRef();

    useFrame((state) => {
        if (ref.current) {
            ref.current.rotation.y = state.clock.getElapsedTime() * 0.05;
            ref.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.1) * 0.2;
        }
    });

    const particles = useMemo(() => {
        return Array.from({ length: 150 }).map((_, i) => ({
            position: [
                (Math.random() - 0.5) * 25,
                (Math.random() - 0.5) * 25,
                (Math.random() - 0.5) * 15
            ],
            color: Math.random() > 0.5 ? "#00f3ff" : "#ff00ff",
            scale: Math.random() * 0.08 + 0.02
        }));
    }, []);

    return (
        <group ref={ref}>
            {particles.map((p, i) => (
                <Float key={i} speed={Math.random() * 2 + 1} rotationIntensity={2} floatIntensity={2}>
                    <mesh position={p.position}>
                        <octahedronGeometry args={[p.scale, 0]} />
                        <meshStandardMaterial
                            color={p.color}
                            emissive={p.color}
                            emissiveIntensity={3}
                            transparent
                            opacity={0.8}
                        />
                    </mesh>
                </Float>
            ))}
        </group>
    );
}

function MovingLight() {
    const ref = useRef();
    useFrame((state) => {
        if (ref.current) {
            ref.current.position.x = Math.sin(state.clock.getElapsedTime()) * 10;
            ref.current.position.y = Math.cos(state.clock.getElapsedTime() * 0.5) * 10;
        }
    });
    return <pointLight ref={ref} intensity={2} color="#00f3ff" distance={20} />;
}

const Background = () => {
    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1, background: 'radial-gradient(circle at center, #0a0a12 0%, #000000 100%)' }}>
            <Canvas camera={{ position: [0, 0, 12], fov: 60 }}>
                <ambientLight intensity={0.2} />
                <MovingLight />
                <pointLight position={[-10, -10, -10]} color="#ff00ff" intensity={1} />
                <Stars radius={100} depth={50} count={7000} factor={4} saturation={0} fade speed={1} />
                <Sparkles count={200} scale={12} size={2} speed={0.4} opacity={0.5} color="#ffffff" />
                <Particles />
                <fog attach="fog" args={['#050510', 8, 25]} />
            </Canvas>
        </div>
    );
};

export default Background;
