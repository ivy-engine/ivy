import { BoxGeometry, Color, Euler, Mesh, MeshStandardMaterial, Object3D, Vector3 } from "three";
import IvyScene from "../ivy-scene/IvyScene";

interface IvyObjectOptions {
  name?: string;
  pos?: Vector3;
  rot?: Euler;
  scale?: Vector3;
  color?: number | Color;
  material?: MeshStandardMaterial; 
  geometry?: BoxGeometry;
}

export default class IvyObject {
  name: string;
  options: IvyObjectOptions;
  object?: Object3D;
  scene?: IvyScene;
  update?: () => void;
  pos?: Vector3;
  rot?: Euler;
  scale?: Vector3;
  material?: MeshStandardMaterial; 
  geometry?: BoxGeometry;

  constructor(options: IvyObjectOptions) {
    this.options = options;
    this.name = options.name ?? "unnamed";
  }

  mount() {
    const geometry = this.options.geometry ?? new BoxGeometry( 1, 1, 1 ); 
    this.geometry = geometry;
    const material = this.options.material ?? new MeshStandardMaterial( {color: this.options.color ?? 0x00ff00} );
    this.material = material;

    const cube = new Mesh( geometry, material );

    cube.position.copy(this.options.pos ?? new Vector3(0, 0, 0));
    this.pos = cube.position;

    cube.rotation.copy(this.options.rot ?? new Euler(0, 0, 0));
    this.rot = cube.rotation;

    cube.scale.copy(this.options.scale ?? new Vector3(1, 1, 1));
    this.scale = cube.scale;
    
    this.scene?.threeScene.add( cube );
    this.object = cube;
  }
 
  destroy() {
    const object = this.object;
    if (!(object instanceof Object3D)) return false;
    // for better memory management and performance
    if (object.geometry) {
        object.geometry.dispose();
    }
    if (object.material) {
        if (object.material instanceof Array) {
            // for better memory management and performance
            object.material.forEach(material => material.dispose());
        } else {
            // for better memory management and performance
            object.material.dispose();
        }
    }
    if (object.parent) {
        object.parent.remove(object);
    }
  }
}