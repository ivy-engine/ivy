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
import { Body, Material, Vec3 } from "cannon-es";

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

export default abstract class IvyElement<
  TOptions extends ElementBaseOption
> extends Abstract<TOptions> {
  children: IvyElement<any>[] = [];
  mesh?: THREE.Mesh;
  material?: MeshStandardMaterial;
  color?: Color;
  physicsBody?: Body;
  physicsMaterial?: Material;

  constructor(options: TOptions) {
    super(options);


    this.initMesh();
    this.setPosition();
  }

  setup(renderer: IvyRenderer, scene?: ThreeScene) {
    this.material = new MeshStandardMaterial({ color: this.color });
   
    if (this.mesh) {
      this.mesh.material = this.material;
    }

    if (this.physicsBody) {
    }
  }

  update = () => {
    this.draw?.(this);
    this.updatePhysics();
    this.drawChildren();
  };

  draw?(element: IvyElement<TOptions>): void;
  initMesh() {}

  /**
   * Physics
   */
  updatePhysics() {
    const body = this.physicsBody;
    if (body && this.mesh) {
      this.mesh.position.set(body.position.x, body.position.y, body.position.z);
      this.mesh.quaternion.set(
        body.quaternion.x,
        body.quaternion.y,
        body.quaternion.z,
        body.quaternion.w
      );
    }
  }

  applyAngularVelocity(x: number, y: number, z: number) {
    const body = this.physicsBody;
    if (body) {
      var directionVector = new Vec3(x, y, z);
      var directionVector = body.quaternion.vmult(directionVector);

      body.angularVelocity.set(
        directionVector.x,
        directionVector.y,
        directionVector.z
      );
    }
  }

  applyDirectionalVelocity(x: number, y: number, z: number) {
    const body = this.physicsBody;
    if (body) {
      const impulse = new Vec3(z, y, x)
      body.applyLocalImpulse(impulse);
    }
  }
}
