import {
  BoxGeometry,
  Color,
  Euler,
  Group,
  Mesh,
  MeshStandardMaterial,
  Object3D,
  Vector3,
  Scene as ThreeScene,
} from "three";
import IvyScene from "../Scene/IvyScene";
import IvyRenderer from "../renderer";
import Abstract from "./Abstract";
import { Body, Material } from "cannon-es";

export interface ElementBaseOption {
  name?: string;
  geometry?: BoxGeometry;
  position?: Vector3;
  scale?: Vector3;
  rotation?: Euler;
  color?: Color;
  group?: boolean;
  mass?: number;
  physicsMaterial?: Material;
}

export default abstract class Element<
  TOptions extends ElementBaseOption
> extends Abstract<TOptions> {
  children: Element<any>[] = [];
  mesh: THREE.Mesh;
  material?: MeshStandardMaterial;
  color?: Color;
  physicsBody?: Body;
  physicsMaterial?: Material;

  constructor(options: TOptions) {
    super(options);

    this.mesh = new Mesh();
    this.object = this.mesh;
    this.mesh.geometry = options.geometry ?? new BoxGeometry(1, 1, 1);
    this.mesh.scale.copy(options.scale ?? new Vector3(1, 1, 1));
    this.physicsMaterial = options.physicsMaterial;

    this.color = this.options.color ?? new Color(0xffffff);

    this.setPosition();
  }

  setup(renderer: IvyRenderer, scene?: ThreeScene) {
    this.material = new MeshStandardMaterial({ color: this.color });
    this.mesh.material = this.material;

    if (this.physicsBody) {

    }
  }

  updatePhysics() {
    const body = this.physicsBody;
    if (body) {
      this.mesh.position.set(body.position.x, body.position.y, body.position.z);
      this.mesh.quaternion.set(
        body.quaternion.x,
        body.quaternion.y,
        body.quaternion.z,
        body.quaternion.w
      );
    }
  }

  update = () => {
    this.draw?.(this);
    this.updatePhysics();
    this.drawChildren();
  };

  draw?(element: Element<TOptions>): void;
}
