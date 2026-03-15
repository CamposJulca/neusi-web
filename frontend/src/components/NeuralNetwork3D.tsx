/**
 * NeuralNetwork3D.tsx
 * Red neuronal 3D interactiva con Three.js / React Three Fiber.
 * Nodos (neuronas) + líneas (sinapsis) + pulsos dorados/cyan (señales).
 */
import { useRef, useMemo, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Float } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";

/* ─── Paleta ─────────────────────────────────────── */
const PURPLE  = new THREE.Color("#6B4EFF");
const MIDPUR  = new THREE.Color("#8e86ff");
const GOLD    = new THREE.Color("#FFB347");
const CYAN    = new THREE.Color("#00CFFF");
const LINEC   = new THREE.Color("#4a3caa");

/* ─── Config ─────────────────────────────────────── */
const NODE_COUNT   = 80;
const MAX_DIST     = 3.2;
const SPEED        = 0.003;
const PULSE_PROB   = 0.004;
const MAX_PULSES   = 60;

/* ─── Generar posiciones iniciales ───────────────── */
function randomNodes(n: number) {
  return Array.from({ length: n }, (_, i) => ({
    pos:    new THREE.Vector3((Math.random() - 0.5) * 14, (Math.random() - 0.5) * 9, (Math.random() - 0.5) * 7),
    vel:    new THREE.Vector3((Math.random() - 0.5) * SPEED, (Math.random() - 0.5) * SPEED, (Math.random() - 0.5) * SPEED),
    r:      0.045 + Math.random() * 0.06,
    bright: Math.random(),
    phase:  Math.random() * Math.PI * 2,
    color:  Math.random() > 0.6 ? MIDPUR.clone() : PURPLE.clone(),
    id:     i,
  }));
}

interface Pulse {
  fromIdx: number;
  toIdx:   number;
  t:       number;
  speed:   number;
  color:   THREE.Color;
}

/* ─── Escena principal ───────────────────────────── */
function NeuralScene({ mouse }: { mouse: React.MutableRefObject<THREE.Vector2> }) {
  const nodesRef    = useRef(randomNodes(NODE_COUNT));
  const pulsesRef   = useRef<Pulse[]>([]);
  const nodesMeshRef = useRef<THREE.InstancedMesh>(null!);
  const lineRef     = useRef<THREE.LineSegments>(null!);
  const pulsesMeshRef = useRef<THREE.InstancedMesh>(null!);

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const { size } = useThree();

  /* Geometrías/materiales pre-creados */
  const nodeMat = useMemo(() => new THREE.MeshBasicMaterial({ vertexColors: true }), []);
  const nodeGeo = useMemo(() => new THREE.SphereGeometry(1, 8, 8), []);

  const lineMat  = useMemo(() => new THREE.LineBasicMaterial({
    vertexColors: true, transparent: true, opacity: 0.35, linewidth: 1,
  }), []);
  const lineGeo  = useMemo(() => new THREE.BufferGeometry(), []);

  const pulseMat = useMemo(() => new THREE.MeshBasicMaterial({ vertexColors: true }), []);
  const pulseGeo = useMemo(() => new THREE.SphereGeometry(1, 6, 6), []);

  /* Limitar conexiones para no saturar */
  const MAX_CONNECTIONS = 600;
  const lineColors = useMemo(() => new Float32Array(MAX_CONNECTIONS * 2 * 3), []);
  const linePositions = useMemo(() => new Float32Array(MAX_CONNECTIONS * 2 * 3), []);

  /* Colores de nodos (no cambian) */
  const nodeColors = useMemo(() => {
    const arr = new Float32Array(NODE_COUNT * 3);
    nodesRef.current.forEach((n, i) => {
      arr[i * 3]     = n.color.r;
      arr[i * 3 + 1] = n.color.g;
      arr[i * 3 + 2] = n.color.b;
    });
    return arr;
  }, []);

  /* Colores de pulsos */
  const pulseColors = useMemo(() => {
    const arr = new Float32Array(MAX_PULSES * 3);
    for (let i = 0; i < MAX_PULSES; i++) {
      const c = Math.random() > 0.55 ? GOLD : CYAN;
      arr[i * 3] = c.r; arr[i * 3 + 1] = c.g; arr[i * 3 + 2] = c.b;
    }
    return arr;
  }, []);

  useFrame(({ clock }) => {
    const t    = clock.getElapsedTime();
    const nodes = nodesRef.current;
    const half  = { x: size.width / 2, y: size.height / 2 };

    /* Mover nodos + influencia del mouse */
    nodes.forEach((n) => {
      n.pos.add(n.vel);
      n.phase += 0.012;

      /* Leve atracción/repulsión hacia el cursor */
      const mx = (mouse.current.x * half.x) / 200;
      const my = (mouse.current.y * half.y) / 200;
      n.pos.x += (mx - n.pos.x) * 0.00015;
      n.pos.y += (my - n.pos.y) * 0.00015;

      /* Rebotar en límites */
      if (Math.abs(n.pos.x) > 7.5) n.vel.x *= -1;
      if (Math.abs(n.pos.y) > 5.0) n.vel.y *= -1;
      if (Math.abs(n.pos.z) > 4.0) n.vel.z *= -1;
    });

    /* Actualizar instanced mesh de nodos */
    if (nodesMeshRef.current) {
      const mesh = nodesMeshRef.current;
      const colors = (mesh.geometry.attributes.color as THREE.BufferAttribute);
      nodes.forEach((n, i) => {
        const scale = n.r * (1 + 0.15 * Math.sin(n.phase + t));
        dummy.position.copy(n.pos);
        dummy.scale.setScalar(scale);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
        /* Pulsar brillo */
        const bright = 0.75 + 0.25 * Math.sin(n.phase + t * 0.8);
        const c = n.color.clone().multiplyScalar(bright);
        colors.setXYZ(i, c.r, c.g, c.b);
      });
      mesh.instanceMatrix.needsUpdate = true;
      colors.needsUpdate = true;
    }

    /* Conexiones */
    if (lineRef.current) {
      let connCount = 0;
      const geo = lineRef.current.geometry as THREE.BufferGeometry;

      for (let i = 0; i < nodes.length && connCount < MAX_CONNECTIONS; i++) {
        for (let j = i + 1; j < nodes.length && connCount < MAX_CONNECTIONS; j++) {
          const d = nodes[i].pos.distanceTo(nodes[j].pos);
          if (d < MAX_DIST) {
            const alpha = (1 - d / MAX_DIST) * 0.6;
            const idx = connCount * 6;
            linePositions[idx]     = nodes[i].pos.x; linePositions[idx+1] = nodes[i].pos.y; linePositions[idx+2] = nodes[i].pos.z;
            linePositions[idx+3]   = nodes[j].pos.x; linePositions[idx+4] = nodes[j].pos.y; linePositions[idx+5] = nodes[j].pos.z;
            lineColors[idx]   = LINEC.r * alpha; lineColors[idx+1] = LINEC.g * alpha; lineColors[idx+2] = LINEC.b * alpha;
            lineColors[idx+3] = LINEC.r * alpha; lineColors[idx+4] = LINEC.g * alpha; lineColors[idx+5] = LINEC.b * alpha;

            /* Spawn pulso */
            if (Math.random() < PULSE_PROB && pulsesRef.current.length < MAX_PULSES) {
              pulsesRef.current.push({
                fromIdx: i, toIdx: j, t: 0,
                speed: 0.006 + Math.random() * 0.01,
                color: Math.random() > 0.5 ? GOLD.clone() : CYAN.clone(),
              });
            }
            connCount++;
          }
        }
      }

      const posAttr = new THREE.BufferAttribute(linePositions.slice(0, connCount * 6), 3);
      const colAttr = new THREE.BufferAttribute(lineColors.slice(0, connCount * 6), 3);
      geo.setAttribute("position", posAttr);
      geo.setAttribute("color",    colAttr);
      geo.setDrawRange(0, connCount * 2);
    }

    /* Pulsos (señales sinápticas) */
    if (pulsesMeshRef.current) {
      const mesh = pulsesMeshRef.current;
      const pColors = (mesh.geometry.attributes.color as THREE.BufferAttribute);
      pulsesRef.current = pulsesRef.current.filter((p, i) => {
        p.t += p.speed;
        if (p.t > 1) return false;
        const from = nodes[p.fromIdx].pos;
        const to   = nodes[p.toIdx].pos;
        const x = from.x + (to.x - from.x) * p.t;
        const y = from.y + (to.y - from.y) * p.t;
        const z = from.z + (to.z - from.z) * p.t;
        const s = 0.06 + 0.02 * Math.sin(p.t * Math.PI);
        dummy.position.set(x, y, z);
        dummy.scale.setScalar(s);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
        pColors.setXYZ(i, p.color.r, p.color.g, p.color.b);
        return true;
      });
      /* Ocultar instancias sobrantes */
      for (let i = pulsesRef.current.length; i < MAX_PULSES; i++) {
        dummy.scale.setScalar(0);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
      }
      mesh.instanceMatrix.needsUpdate = true;
      pColors.needsUpdate = true;
    }
  });

  return (
    <>
      {/* Nodos */}
      <instancedMesh ref={nodesMeshRef} args={[nodeGeo, nodeMat, NODE_COUNT]}>
        <bufferAttribute attach="geometry-attributes-color" args={[nodeColors, 3]} />
      </instancedMesh>

      {/* Conexiones */}
      <lineSegments ref={lineRef} geometry={lineGeo} material={lineMat} />

      {/* Pulsos */}
      <instancedMesh ref={pulsesMeshRef} args={[pulseGeo, pulseMat, MAX_PULSES]}>
        <bufferAttribute attach="geometry-attributes-color" args={[pulseColors, 3]} />
      </instancedMesh>
    </>
  );
}

/* ─── Nodo central flotante (logo NEUSI) ─────────── */
function CenterNode() {
  const meshRef = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.3;
      meshRef.current.rotation.z = clock.getElapsedTime() * 0.15;
      const s = 1 + 0.08 * Math.sin(clock.getElapsedTime() * 1.5);
      meshRef.current.scale.setScalar(s);
    }
  });
  return (
    <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.5}>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[0.38, 1]} />
        <meshBasicMaterial color="#8e86ff" wireframe={false} />
      </mesh>
      <mesh>
        <icosahedronGeometry args={[0.44, 1]} />
        <meshBasicMaterial color="#6B4EFF" wireframe transparent opacity={0.4} />
      </mesh>
    </Float>
  );
}

/* ─── Exportación principal ──────────────────────── */
export default function NeuralNetwork3D() {
  const mouse = useRef(new THREE.Vector2(0, 0));

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    mouse.current.set(
      (e.clientX / window.innerWidth  - 0.5) * 2,
      -(e.clientY / window.innerHeight - 0.5) * 2,
    );
  }, []);

  return (
    <div className="neural-canvas-wrapper" onMouseMove={onMouseMove}>
      <Canvas
        camera={{ position: [0, 0, 10], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <NeuralScene mouse={mouse} />
        <CenterNode />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.4}
          maxPolarAngle={Math.PI * 0.7}
          minPolarAngle={Math.PI * 0.3}
        />
        <EffectComposer>
          <Bloom luminanceThreshold={0.05} luminanceSmoothing={0.4} intensity={1.6} radius={0.8} />
          <Vignette eskil={false} offset={0.15} darkness={0.7} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
