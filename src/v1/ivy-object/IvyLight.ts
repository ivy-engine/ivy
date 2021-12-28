import { BoxGeometry, Color, DirectionalLight, Euler, Material, Mesh, MeshStandardMaterial, MeshToonMaterial, Object3D, Vector3 } from "three";
import IvyScene from "../ivy-scene/IvyScene";
import IvyObject, { IvyObjectOptions } from "./IvyObject";

interface IvyLightOptions extends IvyObjectOptions {
  material: never;
  geometry: never;
  intensity?: number;
}

export default class IvyLight extends IvyObject {
  options: IvyLightOptions;

  constructor(options: IvyLightOptions) {
    super(options);
    this.options = options;
  }

  mount = () => {
    const light = new DirectionalLight( this.options.color ?? 0xffffff, this.options.intensity ?? 0.5 );

    light.position.copy(this.options.pos ?? new Vector3(0, 0, 0));
    this.pos = light.position;

    light.rotation.copy(this.options.rot ?? new Euler(0, 0, 0));
    this.rot = light.rotation;

    light.scale.copy(this.options.scale ?? new Vector3(1, 1, 1));
    this.scale = light.scale;

    
    light.castShadow = true;
    
    this.scene?.threeScene.add( light );
    this.object = light;
  }
 
  // destroy = () => {
  //     super.destroy()
  // }
}