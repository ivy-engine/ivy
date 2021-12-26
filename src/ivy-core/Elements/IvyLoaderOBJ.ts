import { Body, Box, Vec3 } from "cannon-es";
import {
  Euler,
  Group,
  Loader,
  LoadingManager,
  Mesh,
  MeshStandardMaterial,
  Object3D,
  Scene,
  TextureLoader,
  Vector3,
} from "three";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import IvyThree from "../../ivy-three/IvyThree";
import IvyRenderer from "../renderer";
import IvyElement, { ElementBaseOption } from "./IvyElement";

export interface IvyLoaderOptions extends ElementBaseOption {
  obj: string;
  mtl?: string;
}

const fn = () => {}

export class IvyLoaderOBJ extends IvyElement<IvyLoaderOptions> {
  constructor(options: IvyLoaderOptions) {
    super({
      ...options,
    });
  }

  setup = (renderer: IvyThree, scene?: Scene) => {

    // manager.onProgress = function (item, loaded, total) {
    // };

    // texture

    // const textureLoader = new TextureLoader(manager);
    // const texture = textureLoader.load("assets/textures/uv_grid_opengl.jpg");

    // model

    // function onProgress(xhr) {
    //   if (xhr.lengthComputable) {
    //     const percentComplete = (xhr.loaded / xhr.total) * 100;
    //   }
    // }

    // function onError() {}

    // mtl
    const m2 = new LoadingManager(fn);
    var mtlLoader = new MTLLoader(m2);

    const mtl = this.options.mtl;
    if (mtl) {
    mtlLoader.load(mtl, (materials) => {
      materials.preload();
      this.loadObj(materials);
    }, fn, fn);
    } else {
      this.loadObj();
    }

  };

  injectObj = () => {
    // object.traverse(function (child) {
    //   if (child.isMesh) child.material.map = texture;
    // });
    const object = this.object;

    if (object) {
      object.traverse(function (child) {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
      
      object.ivyElement = this;
      this.mesh = object;
      this.object = object;
      this.object?.position.copy(this.options.position ?? new Vector3());
      this.object?.rotation.copy(this.options.rotation ?? new Euler());
      this.object?.scale.copy(this.options.scale ?? new Vector3());
      this.scene?.rawScene.add(object);
    }
  };

  loadObj = (materials?: MTLLoader.MaterialCreator) => {
      const manager = new LoadingManager(this.injectObj);
      const loader = new OBJLoader(manager);

      if (materials) {
        loader.setMaterials(materials);
      }

      loader.load(
        this.options.obj,
        (obj) => {
          obj.ivyElement = this;
          this.object = obj;
        },
        fn,
        fn
      );
  }
}
