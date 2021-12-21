import { BoxGeometry, Color, Euler, Group, Mesh, MeshStandardMaterial, Object3D, Vector3, Scene as ThreeScene } from "three";
import IvyScene from '../Scene/IvyScene'
import IvyRenderer from "../renderer";
import Abstract from "./Abstract";

export interface ElementBaseOption {
  name?: string;
  geometry?: BoxGeometry;
  position?: Vector3;
  scale?: Vector3;
  rotation?: Euler;
  color?: Color;
  group?: boolean;
}

export default abstract class Element<TOptions extends ElementBaseOption> extends Abstract<TOptions> {
  children: Element<any>[] = [];
  mesh: THREE.Mesh;
  material?: MeshStandardMaterial;
  color?: Color;

  constructor(options: TOptions) {
    super(options);
    
    this.mesh = new Mesh();
    this.object = this.mesh;
    this.mesh.geometry = options.geometry ?? new BoxGeometry(1, 1, 1);
    this.mesh.scale.copy(options.scale ?? new Vector3(1, 1, 1));

    this.color = this.options.color ?? new Color(0xffffff); 

    this.setPosition();
  }
 
  setup(renderer: IvyRenderer, scene?: ThreeScene) {
    this.material = new MeshStandardMaterial({ color: this.color });
    this.mesh.material = this.material;
  }

  draw?(element: Element<TOptions>): void;
}