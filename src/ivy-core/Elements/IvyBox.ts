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
      this.mesh.material = new MeshStandardMaterial();
      this.mesh.castShadow = true; 
      this.mesh.receiveShadow = true;
      this.material = new MeshStandardMaterial({ color: this.color });
      this.mesh.material = this.material;
    }
}