import { Body, Box, Vec3 } from "cannon-es";
import {
  AnimationMixer,
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
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import IvyRenderer from "../renderer";
import IvyElement, { ElementBaseOption } from "./IvyElement";

export interface IvyLoaderOptions extends ElementBaseOption {
  fbx: string;
  initialAnimation?: number | string;
}

export class IvyLoaderFBX extends IvyElement<IvyLoaderOptions> {
  constructor(options: IvyLoaderOptions) {
    super({
      ...options,
    });
  }
 
  injectObj = () => {
    const object = this.object;
    if (object) {
      this.mesh = object;
      this.object = object;
      object.ivyElement = this;
      this.object?.position.copy(this.options.position ?? new Vector3());
      this.object?.rotation.copy(this.options.rotation ?? new Euler());
      this.object?.scale.copy(this.options.scale ?? new Vector3(1,1,1));
      this.scene?.rawScene.add(object);
    }
  };

  setup = () => {
    const loader = new FBXLoader();

    loader.load(this.options.fbx, (object) => {
      this.mixer = new AnimationMixer(object);
     
      object.traverse(function (child) {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });

      this.object = object;
      object.ivyElement = this;
      this.injectObj()

      const aniIndex = this.options.initialAnimation;
      if (typeof aniIndex !== 'undefined') {
        this.setAnimation(aniIndex);
      }
    });
  };
 
  setAnimation = (index: number | string) => {
    const animation = typeof index === 'number' ? this.object?.animations[index] : this.object?.animations.find(a => a.name === index);
    if (this.mixer && animation) {
      const action = this.mixer.clipAction(animation);
      action.play();
    }
  }
}
