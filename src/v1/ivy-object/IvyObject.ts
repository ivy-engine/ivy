import { AmbientLight, BoxGeometry, Color, Euler, Light, Material, Mesh, MeshStandardMaterial, MeshToonMaterial, Object3D, Vector3 } from "three";
import IvyScene from "../ivy-scene/IvyScene";
import destroyObject from "../lib/destroyObject";

export interface IvyObjectOptions {
  name?: string;
  pos?: Vector3;
  rot?: Euler;
  scale?: Vector3;
  color?: number | Color;
  material?: MeshStandardMaterial; 
  geometry?: BoxGeometry;
  shadow?: boolean; 
  light?: Light; 
}

export default class IvyObject {
  name: string;
  options: IvyObjectOptions;
  initialItem = false;
  object?: Object3D;
  scene?: IvyScene;
  update?: () => void;
  pos?: Vector3;
  rot?: Euler;
  scale?: Vector3;
  material?: Material; 
  geometry?: BoxGeometry;

  constructor(options: IvyObjectOptions) {
    this.options = options;
    this.name = options.name ?? "unnamed";
  }

  mount = () => {
    const light = this.options.light;
    if (light) {
      this.mountLight();
    } else {
      this.mountObject();
    }
  }

  setObjectSize = () => {
    if (!this.object) return;

    this.object.position.copy(this.options.pos ?? new Vector3(0, 0, 0));
    this.pos = this.object.position;

    this.object.rotation.copy(this.options.rot ?? new Euler(0, 0, 0));
    this.rot = this.object.rotation;

    this.object.scale.copy(this.options.scale ?? new Vector3(1, 1, 1));
    this.scale = this.object.scale;
  }

  mountLight = () => {
    const light = this.options.light;
    if (!light) return;
    this.object = light;
    light.position.copy(this.options.pos ?? new Vector3(0, 0, 0));
    
    this.scene?.threeScene.add( this.object );
    light.castShadow = this.options.shadow ?? false;

    this.setObjectSize();
  }

  mountObject = () => {
    const geometry = this.options.geometry ?? new BoxGeometry( 1, 1, 1 ); 
    this.geometry = geometry;
    const material = this.options.material ?? new MeshStandardMaterial( {color: this.options.color ?? 0x00ff00} );
    this.material = material;
    this.object = new Mesh( geometry, material );
    this.scene?.threeScene.add( this.object );
   
    if (this.options.shadow) {
      this.object.castShadow = true;
      this.object.receiveShadow = true;
    }
    this.setObjectSize();
  }
 
  destroy = () => {
    this.object && destroyObject(this.object)
    void this.scene?.removeFromStack(this);
  }
}