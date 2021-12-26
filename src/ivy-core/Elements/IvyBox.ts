import { Body, Box, Vec3 } from "cannon-es";
import {
  BoxGeometry,
  Color,
  Mesh,
  MeshStandardMaterial,
  Scene,
  Vector3,
} from "three";
import IvyThree from "../../ivy-three/IvyThree";
import IvyRenderer from "../renderer";
import IvyElement, { ElementBaseOption } from "./IvyElement";

export interface IvyBoxOptions extends ElementBaseOption {}

export class IvyBox extends IvyElement<IvyBoxOptions> {
  constructor(options?: IvyBoxOptions) {
    super(options ?? {});
  }

  setup(renderer: IvyThree, scene?: Scene): void {
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
    this.material = this.options.material ?? new MeshStandardMaterial({ color: this.color });
    this.mesh.material = this.material;

    if (this.scene?.physicsWorld && typeof this.options.mass === "number") {
      const world = this.scene.physicsWorld;
      const { position, quaternion } = this.mesh;
      const { width, height, depth } = this.mesh.geometry.parameters;
      const cubeShape = new Box(
        new Vec3(width * 0.5, height * 0.5, depth * 0.5)
      );
      const cubeBody = new Body({
        mass: this.options.mass ?? 1,
        shape: cubeShape,
      });
      cubeBody.position.set(position.x, position.y, position.z);
      cubeBody.quaternion.set(
        quaternion.x,
        quaternion.y,
        quaternion.z,
        quaternion.w
      );
      cubeBody.material = this.options.physicsMaterial;
      world.addBody(cubeBody);
      this.physicsBody = cubeBody;
    }
  }

  initMesh(): void {
    const { geometry, scale } = this.options;
    this.object = this.mesh;
    this.mesh.ivyElement = this;
    this.mesh.geometry = geometry ?? new BoxGeometry(1, 1, 1);
    this.mesh.scale.copy(scale ?? new Vector3(1, 1, 1));
    this.physicsMaterial = this.physicsMaterial;

    this.color = this.options.color ?? new Color(0xffffff);
  }
}
