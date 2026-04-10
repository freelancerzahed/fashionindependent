declare module "three/examples/jsm/loaders/GLTFLoader" {
  import { Loader, LoadingManager } from "three";

  export class GLTFLoader extends Loader {
    constructor(manager?: LoadingManager);
    load(
      url: string,
      onLoad: (gltf: any) => void,
      onProgress?: (event: ProgressEvent<EventTarget>) => void,
      onError?: (event: ErrorEvent) => void
    ): void;
    parse(
      data: ArrayBuffer | string,
      path: string,
      onLoad: (gltf: any) => void,
      onError?: (event: ErrorEvent) => void
    ): void;
    setMeshoptDecoder(decoder: any): this;
  }
}

declare module "three/examples/jsm/libs/meshopt_decoder.module.js" {
  export const MeshoptDecoder: any;
}
