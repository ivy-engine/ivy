import { Camera, Color, DirectionalLight, Euler, Event, Object3D, PerspectiveCamera, Scene, Vector3 } from "three";
import renderer from "../renderer";
import IvyAbstract from "./IvyAbstract";
import { ElementBaseOption } from "./IvyElement";

export interface IvyCameraOptions extends ElementBaseOption {
  position?: Vector3;
  rotation?: Euler;
}

export class IvyCamera extends IvyAbstract<IvyCameraOptions> {
  object?: Camera;
  constructor(options?: IvyCameraOptions) {
    super(options ?? {});

    const {
      rotation = new Euler(-Math.PI / 20, 0, 0),
      position = new Vector3(0, 3, 12),
    } = this.options;

    const camera = new PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.25,
      400
    );
    camera.position.copy(position);
    camera.rotation.copy(rotation);
    this.object = camera;
  }

  create(renderer: renderer, scene?: Scene): void {}
}
