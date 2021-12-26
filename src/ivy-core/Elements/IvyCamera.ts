import { Camera, Color, DirectionalLight, Euler, Event, Object3D, PerspectiveCamera, Scene, Vector3 } from "three";
import IvyThree from "../../ivy-three/IvyThree";
import renderer from "../renderer";
import IvyAbstract from "./IvyAbstract";
import { ElementBaseOption } from "./IvyElement";

export interface IvyCameraOptions extends ElementBaseOption {
  position?: Vector3;
  rotation?: Euler;
  lookAt?: Vector3; 
}

export class IvyCamera extends IvyAbstract<IvyCameraOptions> {
  object?: Camera;
  constructor(options?: IvyCameraOptions) {
    super(options ?? {});
  }

  create(renderer: IvyThree, scene?: Scene): void {
    const {
      rotation = new Euler(-Math.PI / 20, 0, 0),
      position = new Vector3(0, 3, 12),
      lookAt
    } = this.options;
    const el = renderer.element;

    const camera = new PerspectiveCamera(
      60,
      el.clientWidth / el.clientHeight,
      0.25,
      1000
    );
    camera.position.copy(position);
    camera.rotation.copy(rotation);

    if (lookAt) {
      camera.lookAt(lookAt);
    }

    this.object = camera;
    camera.ivyElement = camera;
  }
}
