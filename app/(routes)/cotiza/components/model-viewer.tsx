"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";

type ModelViewerProps = {
  file: File;
  scalePercent: number;
};

type ThreeObject = {
  position: {
    set: (x: number, y: number, z: number) => void;
  };
  scale: {
    setScalar: (value: number) => void;
    multiplyScalar: (value: number) => void;
  };
  add?: (child: unknown) => void;
  traverse: (callback: (child: unknown) => void) => void;
};

type ModelRoot = Pick<ThreeObject, "scale" | "add">;

type CameraLike = {
  position: {
    set: (x: number, y: number, z: number) => void;
  };
  lookAt: (x: number, y: number, z: number) => void;
};

function frameObject(object: ThreeObject, modelRoot: ModelRoot, camera: unknown) {
  const box = new THREE.Box3().setFromObject(object);
  const center = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3());
  const maxSize = Math.max(size.x, size.y, size.z, 1);
  const fitScale = 2.4 / maxSize;

  object.position.set(-center.x, -center.y, -center.z);
  modelRoot.scale.setScalar(fitScale);
  (camera as CameraLike).position.set(0, 0.45, 4);
  (camera as CameraLike).lookAt(0, 0, 0);
}

function createOrangeMatcapTexture() {
  const canvas = document.createElement("canvas");
  const size = 256;
  const context = canvas.getContext("2d");

  canvas.width = size;
  canvas.height = size;

  if (!context) {
    return null;
  }

  const base = context.createRadialGradient(92, 70, 12, 128, 132, 156);
  base.addColorStop(0, "#ffcf8a");
  base.addColorStop(0.22, "#ff7a19");
  base.addColorStop(0.62, "#e74608");
  base.addColorStop(1, "#6f1704");
  context.fillStyle = base;
  context.fillRect(0, 0, size, size);

  const shine = context.createRadialGradient(76, 54, 0, 76, 54, 86);
  shine.addColorStop(0, "rgba(255,255,255,0.82)");
  shine.addColorStop(0.34, "rgba(255,202,116,0.42)");
  shine.addColorStop(1, "rgba(255,255,255,0)");
  context.fillStyle = shine;
  context.fillRect(0, 0, size, size);

  const lowerGlow = context.createRadialGradient(164, 182, 12, 164, 182, 116);
  lowerGlow.addColorStop(0, "rgba(255,106,16,0.72)");
  lowerGlow.addColorStop(1, "rgba(72,11,0,0)");
  context.fillStyle = lowerGlow;
  context.fillRect(0, 0, size, size);

  const texture = new THREE.CanvasTexture(canvas);

  if ("SRGBColorSpace" in THREE) {
    texture.colorSpace = THREE.SRGBColorSpace;
  }

  texture.needsUpdate = true;
  return texture;
}

function createVisibleMaterial(matcapTexture: unknown) {
  if (matcapTexture) {
    return new THREE.MeshMatcapMaterial({
      matcap: matcapTexture,
      side: THREE.DoubleSide,
    });
  }

  return new THREE.MeshNormalMaterial({
    side: THREE.DoubleSide,
  });
}

function addEdges(mesh: unknown) {
  const typedMesh = mesh as {
    geometry?: unknown;
    add?: (child: unknown) => void;
  };

  if (!typedMesh.geometry || !typedMesh.add) {
    return;
  }

  const edges = new THREE.EdgesGeometry(typedMesh.geometry, 24);
  const lines = new THREE.LineSegments(
    edges,
    new THREE.LineBasicMaterial({
      color: 0x5f1d08,
      transparent: true,
      opacity: 0.2,
    })
  );

  typedMesh.add(lines);
}

function createStlObject(buffer: ArrayBuffer, matcapTexture: unknown) {
  const geometry = new STLLoader().parse(buffer);
  geometry.computeVertexNormals();

  const mesh = new THREE.Mesh(geometry, createVisibleMaterial(matcapTexture));
  addEdges(mesh);

  return mesh;
}

function createObjObject(text: string, matcapTexture: unknown) {
  const object = new OBJLoader().parse(text);

  object.traverse((child: unknown) => {
    if (child instanceof THREE.Mesh) {
      (child as { geometry?: { computeVertexNormals?: () => void } }).geometry?.computeVertexNormals?.();
      (child as { material: unknown }).material = createVisibleMaterial(matcapTexture);
      addEdges(child);
    }
  });

  return object;
}

export function ModelViewer({ file, scalePercent }: ModelViewerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<unknown>(null);
  const renderRef = useRef<(() => void) | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    let cancelled = false;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.01, 100);
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    const modelRoot = new THREE.Group();
    const ambient = new THREE.HemisphereLight(0xffffff, 0x7a7a7a, 2.7);
    const key = new THREE.DirectionalLight(0xffffff, 4.2);
    const fill = new THREE.DirectionalLight(0xffffff, 1.8);
    const matcapTexture = createOrangeMatcapTexture();
    let animationFrame = 0;

    setError(null);
    setLoading(true);
    rendererRef.current = renderer;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setClearColor(0xbfbfbf, 1);
    container.appendChild(renderer.domElement);
    renderer.domElement.className = "h-full w-full cursor-grab active:cursor-grabbing";

    key.position.set(3, 4, 5);
    fill.position.set(-4, 2, -2);
    modelRoot.rotation.set(-0.25, 0.65, 0);
    scene.add(ambient, key, fill, modelRoot);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.enablePan = false;
    controls.enableZoom = true;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1;
    controls.minDistance = 2.2;
    controls.maxDistance = 7;
    controls.minPolarAngle = 0.18;
    controls.maxPolarAngle = Math.PI - 0.18;
    controls.rotateSpeed = 0.7;
    controls.zoomSpeed = 0.9;
    controls.target.set(0, 0, 0);
    controls.update();

    const render = () => {
      const width = container.clientWidth || 1;
      const height = container.clientHeight || 1;

      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.render(scene, camera);
    };

    renderRef.current = render;

    const animate = () => {
      controls.update();
      render();
      animationFrame = window.requestAnimationFrame(animate);
    };

    const pauseAutoRotate = () => {
      controls.autoRotate = false;
    };

    const resumeAutoRotate = () => {
      controls.autoRotate = true;
    };

    const load = async () => {
      try {
        const extension = file.name.split(".").pop()?.toLowerCase();
        let object: ThreeObject | null = null;

        if (extension === "stl") {
          object = createStlObject(await file.arrayBuffer(), matcapTexture);
        }

        if (extension === "obj") {
          object = createObjObject(await file.text(), matcapTexture);
        }

        if (!object) {
          throw new Error("unsupported");
        }

        if (cancelled) {
          return;
        }

        frameObject(object, modelRoot, camera);
        modelRoot.add(object);
        setLoading(false);
        animate();
      } catch {
        if (!cancelled) {
          setError("Vista previa no disponible para este archivo.");
          setLoading(false);
        }
      }
    };

    const handleResize = () => render();
    const observer = new ResizeObserver(handleResize);
    observer.observe(container);
    load();

    const blockPageScroll = (event: WheelEvent) => {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
    };

    const pauseAutoRotateOnWheel = (event: WheelEvent) => {
      blockPageScroll(event);
      pauseAutoRotate();
    };

    const previousOverflow = {
      body: "",
      documentElement: "",
    };

    const lockPageScroll = () => {
      previousOverflow.body = document.body.style.overflow;
      previousOverflow.documentElement = document.documentElement.style.overflow;
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    };

    const unlockPageScroll = () => {
      document.body.style.overflow = previousOverflow.body;
      document.documentElement.style.overflow = previousOverflow.documentElement;
    };

    container.addEventListener("mouseenter", lockPageScroll);
    container.addEventListener("mouseleave", unlockPageScroll);
    container.addEventListener("wheel", blockPageScroll, { passive: false });
    renderer.domElement.addEventListener("pointerdown", pauseAutoRotate);
    renderer.domElement.addEventListener("wheel", pauseAutoRotateOnWheel, {
      passive: false,
    });
    renderer.domElement.addEventListener("pointerleave", resumeAutoRotate);

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(animationFrame);
      unlockPageScroll();
      container.removeEventListener("mouseenter", lockPageScroll);
      container.removeEventListener("mouseleave", unlockPageScroll);
      container.removeEventListener("wheel", blockPageScroll);
      renderer.domElement.removeEventListener("pointerdown", pauseAutoRotate);
      renderer.domElement.removeEventListener("wheel", pauseAutoRotateOnWheel);
      renderer.domElement.removeEventListener("pointerleave", resumeAutoRotate);
      observer.disconnect();
      controls.dispose();
      renderRef.current = null;
      rendererRef.current = null;
      matcapTexture?.dispose?.();
      renderer.dispose();
      container.removeChild(renderer.domElement);
    };
  }, [file, scalePercent]);

  return (
    <div
      className="absolute inset-0 touch-none bg-[#bfbfbf]"
    >
      <div ref={containerRef} className="h-full w-full" />
      <p className="pointer-events-none absolute left-4 top-4 text-[10px] uppercase tracking-[0.08em] text-black/65">
        Vista 3D
      </p>
      <p className="pointer-events-none absolute right-4 top-4 text-[10px] uppercase tracking-[0.08em] text-black/65">
        Arrastra para rotar
      </p>
      {loading && (
        <p className="pointer-events-none absolute inset-x-4 top-1/2 -translate-y-1/2 text-center text-xs uppercase tracking-[0.18em] text-black/55">
          Preparando modelo
        </p>
      )}
      {error && (
        <p className="pointer-events-none absolute inset-x-4 top-1/2 -translate-y-1/2 text-center text-sm text-black/70">
          {error}
        </p>
      )}
    </div>
  );
}
