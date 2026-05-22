declare module "three";

declare module "three/examples/jsm/controls/OrbitControls.js" {
  export class OrbitControls {
    enableDamping: boolean;
    dampingFactor: number;
    enablePan: boolean;
    enableZoom: boolean;
    autoRotate: boolean;
    autoRotateSpeed: number;
    minDistance: number;
    maxDistance: number;
    minPolarAngle: number;
    maxPolarAngle: number;
    rotateSpeed: number;
    zoomSpeed: number;
    target: { set: (x: number, y: number, z: number) => void };
    constructor(camera: unknown, domElement: HTMLElement);
    addEventListener(type: string, listener: () => void): void;
    removeEventListener(type: string, listener: () => void): void;
    update(): void;
    dispose(): void;
  }
}

declare module "three/examples/jsm/loaders/OBJLoader.js" {
  export class OBJLoader {
    parse(text: string): import("three").Object3D;
  }
}

declare module "three/examples/jsm/loaders/STLLoader.js" {
  export class STLLoader {
    parse(data: ArrayBuffer): import("three").BufferGeometry;
  }
}
