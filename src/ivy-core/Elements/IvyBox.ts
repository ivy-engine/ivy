import { Body, Box, Vec3 } from "cannon-es";
import { MeshStandardMaterial, Scene } from "three";
import IvyRenderer from "../renderer";
import Element, { ElementBaseOption } from "./Element";

export interface IvyBoxOptions extends ElementBaseOption {
}

export class IvyBox extends Element<IvyBoxOptions> {
    constructor(options?: IvyBoxOptions) {
      super(options ?? {});
    }
   
    setup(renderer: IvyRenderer, scene?: Scene): void {
      this.mesh.castShadow = true; 
      this.mesh.receiveShadow = true;
      this.material = new MeshStandardMaterial({ color: this.color });
      this.mesh.material = this.material;

      if (this.scene?.physicsWorld) {
        const world = this.scene.physicsWorld;
        const {position, quaternion} = this.mesh;
        const {width, height, depth} = this.mesh.geometry.parameters;
        const cubeShape = new Box(new Vec3(width * 0.5, height * 0.5, depth * 0.5))
        const cubeBody = new Body({ mass: this.options.mass ?? 1, shape: cubeShape });
        cubeBody.position.set(position.x, position.y,position.z);
        cubeBody.quaternion.set(quaternion.x, quaternion.y, quaternion.z, quaternion.w);
        cubeBody.material = this.physicsMaterial;
        world.addBody(cubeBody)
        this.physicsBody = cubeBody;
      }
    }
}