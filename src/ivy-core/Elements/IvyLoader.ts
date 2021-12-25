import { Body, Box, Vec3 } from "cannon-es";
import {
  LoadingManager,
  MeshStandardMaterial,
  Scene,
  TextureLoader,
} from "three";
import { OBJLoader } from "../../ivy-three/loaders/OBJloader";
import IvyRenderer from "../renderer";
import IvyElement, { ElementBaseOption } from "./IvyElement";

export interface IvyLoaderOptions extends ElementBaseOption {
  model: string;
}

export class IvyLoader extends IvyElement<IvyLoaderOptions> {
  constructor(options: IvyLoaderOptions) {
    super({
      ...options,
    });
  }

  setup(renderer: IvyRenderer, scene?: Scene): void {
    let object;
    function loadModel() {
      object.traverse(function (child) {
        if (child.isMesh) child.material.map = texture;
      });

      // object.position.y = -95;
      scene.add(object);
    }

    const manager = new LoadingManager(loadModel);

    manager.onProgress = function (item, loaded, total) {
      console.log(item, loaded, total);
    };

    // texture

    const textureLoader = new TextureLoader(manager);
    const texture = textureLoader.load("assets/textures/uv_grid_opengl.jpg");

    // model

    function onProgress(xhr) {
      if (xhr.lengthComputable) {
        const percentComplete = (xhr.loaded / xhr.total) * 100;
        console.log("model " + Math.round(percentComplete, 2) + "% downloaded");
      }
    }

    function onError() {}

    const loader = new OBJLoader(manager);
    loader.load(
      this.options.model,
      function (obj) {
        object = obj;
      },
      onProgress,
      onError
    );
  }
}
