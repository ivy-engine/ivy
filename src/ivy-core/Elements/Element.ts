import { BoxGeometry, Color, Euler, Mesh, MeshStandardMaterial, Vector3 } from "three";
import IvyRenderer from "../renderer";

export interface ElementBaseOption {
  geometry?: BoxGeometry;
  position?: Vector3;
  scale?: Vector3;
  rotation?: Euler;
  color?: Color;
}

export default abstract class Element<TOptions extends ElementBaseOption> {
  private options: TOptions;
  mesh: THREE.Mesh;
  material: MeshStandardMaterial = new MeshStandardMaterial();

  constructor(options: TOptions) {
    this.options = options;
    this.mesh = new Mesh();
    this.material.color = this.options.color ?? new Color(0xffffff); 
    this.mesh.position.copy(options.position ?? new Vector3());
    this.mesh.scale.copy(options.scale ?? new Vector3(1, 1, 1));
    this.mesh.rotation.copy(options.rotation ?? new Euler());
    this.mesh.geometry = options.geometry ?? new BoxGeometry(1, 1, 1);
  }

  abstract create(renderer: IvyRenderer): void;
  draw?(element: Element<TOptions>): void;
}