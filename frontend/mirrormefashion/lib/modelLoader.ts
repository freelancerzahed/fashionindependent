"use client";

import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";

interface ModelLoaderResult {
  scene: THREE.Scene;
  model: THREE.Object3D | null; // model starts null until loadPromise resolves
  renderer: THREE.WebGLRenderer;
  loadPromise: Promise<THREE.Object3D>;
  dispose: () => void;
}

export function modelLoader(
  canvas: HTMLCanvasElement,
  modelUrl: string,
  scaleFactor = 1.0,
  rotationButtonId = "bodyRearBtn"
): ModelLoaderResult {
  if (!canvas) {
    return {
      scene: new THREE.Scene(),
      model: null,
      renderer: new THREE.WebGLRenderer(),
      dispose: () => {},
      loadPromise: Promise.reject("No canvas provided"),
    };
  }

  // Renderer
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: "high-performance",
  });
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;

  // Scene
  const scene = new THREE.Scene();
  scene.background = null;

  // Lights
  const keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
  keyLight.position.set(10, 15, 10);
  keyLight.castShadow = true;
  scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight(0xffffff, 1.2);
  fillLight.position.set(-8, 8, -8);
  scene.add(fillLight);

  const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
  scene.add(ambientLight);

  const hemisphereLight = new THREE.HemisphereLight(0xffffbb, 0x080820, 0.8);
  scene.add(hemisphereLight);

  // Camera
  let aspect = canvas.clientWidth / canvas.clientHeight;
  const orthoSize = 35;
  const camera = new THREE.OrthographicCamera(
    -orthoSize * aspect,
    orthoSize * aspect,
    orthoSize,
    -orthoSize,
    0.1,
    2000
  );
  camera.position.set(0, 0, 500);
  camera.lookAt(0, 0, 0);

  // Material enhancer
  const enhanceMaterial = (mat: any) => {
    const isPrincipled =
      mat?.name &&
      (mat.name.includes("Principled") || mat.name.includes("principled"));

    const newMat = new THREE.MeshStandardMaterial({
      color: mat.color ?? new THREE.Color(0.8, 0.8, 0.8),
      roughness: mat.roughness ?? 0.5,
      metalness: mat.metalness ?? 0.0,
      transparent: mat.transparent || false,
      opacity: mat.opacity ?? 1.0,
      side: THREE.DoubleSide,
      envMapIntensity: 1.0,
    });

    if (mat.map) newMat.map = mat.map;
    if (mat.normalMap) {
      newMat.normalMap = mat.normalMap;
      newMat.normalScale = new THREE.Vector2(1, 1);
    }

    if (isPrincipled && mat.specular !== undefined) {
      newMat.roughness = 1 - mat.specular * 0.8;
    }

    newMat.needsUpdate = true;
    return newMat;
  };

  let model: THREE.Object3D | null = null;

  const loader = new GLTFLoader();
  loader.setMeshoptDecoder(MeshoptDecoder);

  const loadPromise: Promise<THREE.Object3D> = new Promise(
    (resolve, reject) => {
      loader.load(
        modelUrl,
        (gltf) => {
          model = gltf.scene;

          if (model) {
            model.traverse((obj) => {
              if (obj instanceof THREE.Mesh) {
                obj.material = Array.isArray(obj.material)
                  ? obj.material.map(enhanceMaterial)
                  : enhanceMaterial(obj.material);
                obj.castShadow = true;
                obj.receiveShadow = true;
              }
            });
          }

          if (model) {
            model.scale.set(scaleFactor, scaleFactor, scaleFactor);

            const box = new THREE.Box3().setFromObject(model);
            const center = box.getCenter(new THREE.Vector3());
            model.position.sub(center);

            scene.add(model);
          }

          // Store model reference for rotation
          (scene as any).modelReference = model;
          console.log("Model reference stored in scene");
          


          if (model) {
            resolve(model);
          } else {
            reject(new Error("Failed to load model: gltf.scene is null"));
          }
        },
        (progress) => {
          console.log(
            `Loading: ${((progress.loaded / progress.total) * 100).toFixed(1)}%`
          );
        },
        (err) => reject(err)
      );
    }
  );

  const handleResize = () => {
    aspect = canvas.clientWidth / canvas.clientHeight;
    camera.left = -orthoSize * aspect;
    camera.right = orthoSize * aspect;
    camera.top = orthoSize;
    camera.bottom = -orthoSize;
    camera.updateProjectionMatrix();

    const dpr = Math.min(window.devicePixelRatio, 2);
    renderer.setPixelRatio(dpr);
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
  };
  window.addEventListener("resize", handleResize);
  handleResize();

  let animationId: number;
  const animate = () => {
    animationId = requestAnimationFrame(animate);
    renderer.render(scene, camera);
  };
  animate();

  const dispose = () => {
    window.removeEventListener("resize", handleResize);
    cancelAnimationFrame(animationId);
    renderer.dispose();
    scene.clear();
  };

  // Store renderer in scene for access in rotation function
  (scene as any).renderer = renderer;
  (scene as any).camera = camera;
  
  return { scene, model, renderer, loadPromise, dispose };
}
