"use client";

import { useEffect, useRef, useState } from "react";

type Point3 = [number, number, number];
type Face = [number, number, number];

type Mesh = {
  vertices: Point3[];
  faces: Face[];
};

type ModelViewerProps = {
  file: File;
  scalePercent: number;
};

const MAX_FACES = 12000;

function parseNumber(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function normalizeMesh(mesh: Mesh): Mesh {
  if (mesh.vertices.length === 0) {
    return mesh;
  }

  const min: Point3 = [Infinity, Infinity, Infinity];
  const max: Point3 = [-Infinity, -Infinity, -Infinity];

  for (const vertex of mesh.vertices) {
    for (let axis = 0; axis < 3; axis += 1) {
      min[axis] = Math.min(min[axis], vertex[axis]);
      max[axis] = Math.max(max[axis], vertex[axis]);
    }
  }

  const center: Point3 = [
    (min[0] + max[0]) / 2,
    (min[1] + max[1]) / 2,
    (min[2] + max[2]) / 2,
  ];
  const size = Math.max(max[0] - min[0], max[1] - min[1], max[2] - min[2], 1);

  return {
    vertices: mesh.vertices.map((vertex) => [
      (vertex[0] - center[0]) / size,
      (vertex[1] - center[1]) / size,
      (vertex[2] - center[2]) / size,
    ]),
    faces: mesh.faces.slice(0, MAX_FACES),
  };
}

function parseObj(text: string, scale: number): Mesh {
  const vertices: Point3[] = [];
  const faces: Face[] = [];

  for (const line of text.split(/\r?\n/)) {
    const parts = line.trim().split(/\s+/);

    if (parts[0] === "v" && parts.length >= 4) {
      vertices.push([
        parseNumber(parts[1]) * scale,
        parseNumber(parts[2]) * scale,
        parseNumber(parts[3]) * scale,
      ]);
    }

    if (parts[0] === "f" && parts.length >= 4) {
      const indexes = parts
        .slice(1)
        .map((part) => Number(part.split("/")[0]) - 1)
        .filter((index) => Number.isInteger(index) && index >= 0);

      for (let index = 1; index < indexes.length - 1; index += 1) {
        faces.push([indexes[0], indexes[index], indexes[index + 1]]);
      }
    }
  }

  return normalizeMesh({ vertices, faces });
}

function parseAsciiStl(text: string, scale: number): Mesh {
  const vertices: Point3[] = [];
  const faces: Face[] = [];
  const matches = text.matchAll(
    /vertex\s+([-+]?\d*\.?\d+(?:[eE][-+]?\d+)?)\s+([-+]?\d*\.?\d+(?:[eE][-+]?\d+)?)\s+([-+]?\d*\.?\d+(?:[eE][-+]?\d+)?)/g
  );

  for (const match of matches) {
    vertices.push([
      parseNumber(match[1]) * scale,
      parseNumber(match[2]) * scale,
      parseNumber(match[3]) * scale,
    ]);

    if (vertices.length % 3 === 0) {
      const last = vertices.length - 1;
      faces.push([last - 2, last - 1, last]);
    }
  }

  return normalizeMesh({ vertices, faces });
}

function parseBinaryStl(buffer: ArrayBuffer, scale: number): Mesh | null {
  const view = new DataView(buffer);

  if (buffer.byteLength < 84) {
    return null;
  }

  const triangleCount = view.getUint32(80, true);
  const expectedLength = 84 + triangleCount * 50;

  if (expectedLength !== buffer.byteLength) {
    return null;
  }

  const vertices: Point3[] = [];
  const faces: Face[] = [];

  for (let triangle = 0; triangle < triangleCount; triangle += 1) {
    const triangleOffset = 84 + triangle * 50;
    const faceStart = vertices.length;

    for (let vertex = 0; vertex < 3; vertex += 1) {
      const vertexOffset = triangleOffset + 12 + vertex * 12;
      vertices.push([
        view.getFloat32(vertexOffset, true) * scale,
        view.getFloat32(vertexOffset + 4, true) * scale,
        view.getFloat32(vertexOffset + 8, true) * scale,
      ]);
    }

    faces.push([faceStart, faceStart + 1, faceStart + 2]);
  }

  return normalizeMesh({ vertices, faces });
}

async function parseModel(file: File, scalePercent: number) {
  const scale = scalePercent / 100;
  const extension = file.name.split(".").pop()?.toLowerCase();

  if (extension === "obj") {
    return parseObj(await file.text(), scale);
  }

  if (extension === "stl") {
    const buffer = await file.arrayBuffer();
    const binary = parseBinaryStl(buffer, scale);

    if (binary) {
      return binary;
    }

    return parseAsciiStl(new TextDecoder().decode(buffer), scale);
  }

  return null;
}

function rotate(vertex: Point3, rotationX: number, rotationY: number): Point3 {
  const cosX = Math.cos(rotationX);
  const sinX = Math.sin(rotationX);
  const cosY = Math.cos(rotationY);
  const sinY = Math.sin(rotationY);
  const y = vertex[1] * cosX - vertex[2] * sinX;
  const z = vertex[1] * sinX + vertex[2] * cosX;
  const x = vertex[0] * cosY + z * sinY;

  return [x, y, -vertex[0] * sinY + z * cosY];
}

export function ModelViewer({ file, scalePercent }: ModelViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [mesh, setMesh] = useState<Mesh | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    setMesh(null);
    setError(null);

    parseModel(file, scalePercent)
      .then((nextMesh) => {
        if (!cancelled) {
          if (!nextMesh || nextMesh.vertices.length === 0) {
            setError("Vista previa no disponible para este archivo.");
            return;
          }

          setMesh(nextMesh);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError("No pude preparar la vista previa 3D.");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [file, scalePercent]);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas || !mesh) {
      return;
    }

    const context = canvas.getContext("2d");

    if (!context) {
      return;
    }

    let frame = 0;
    let animationId = 0;

    const draw = () => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const pixelRatio = window.devicePixelRatio || 1;

      canvas.width = Math.max(1, Math.floor(width * pixelRatio));
      canvas.height = Math.max(1, Math.floor(height * pixelRatio));
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      context.clearRect(0, 0, width, height);

      const rotationY = frame * 0.01;
      const rotationX = -0.55;
      const projected = mesh.vertices.map((vertex) => {
        const rotated = rotate(vertex, rotationX, rotationY);
        const depth = 1.8 + rotated[2];
        const size = Math.min(width, height) * 1.2;

        return {
          x: width / 2 + (rotated[0] * size) / depth,
          y: height / 2 - (rotated[1] * size) / depth,
          z: rotated[2],
        };
      });

      context.fillStyle = "rgba(255,255,255,0.06)";
      context.strokeStyle = "rgba(255,255,255,0.34)";
      context.lineWidth = 1;

      const sortedFaces = mesh.faces
        .map((face) => ({
          face,
          z:
            (projected[face[0]].z + projected[face[1]].z + projected[face[2]].z) /
            3,
        }))
        .sort((a, b) => a.z - b.z);

      for (const { face } of sortedFaces) {
        const a = projected[face[0]];
        const b = projected[face[1]];
        const c = projected[face[2]];

        context.beginPath();
        context.moveTo(a.x, a.y);
        context.lineTo(b.x, b.y);
        context.lineTo(c.x, c.y);
        context.closePath();
        context.fill();
        context.stroke();
      }

      frame += 1;
      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [mesh]);

  return (
    <div className="absolute inset-0 bg-[#050505]">
      <canvas ref={canvasRef} className="h-full w-full" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/70 to-transparent" />
      <p className="absolute left-4 top-4 text-[11px] uppercase tracking-[0.24em] text-white/55">
        Vista 3D
      </p>
      {!mesh && !error && (
        <p className="absolute inset-x-4 top-1/2 -translate-y-1/2 text-center text-xs uppercase tracking-[0.24em] text-white/55">
          Preparando modelo
        </p>
      )}
      {error && (
        <p className="absolute inset-x-4 top-1/2 -translate-y-1/2 text-center text-sm text-white/70">
          {error}
        </p>
      )}
    </div>
  );
}
